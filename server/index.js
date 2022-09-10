import Spotify from 'spotify-web-api-node';
import { resolve } from 'path';
import express from 'express';
import { getWebAccessToken, getFriendActivity } from 'spotify-buddylist';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setPlayback } from './utils/play.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
dayjs.extend(relativeTime);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;

const spotifyApi = new Spotify({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});
const scopes = process.env.SCOPES;
const STATE_KEY = 'spotify_auth_state';
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Token, Refresh-Token, Expiry-Date, User-Id',
  );
  res.header('Access-Control-Allow-Methods', 'PATCH');

  const spotifyUser = new Spotify({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ...(req.header('access-token') && {
      accessToken: req.header('access-token'),
    }),
    ...(req.header('refresh-token') && {
      refreshToken: req.header('refresh-token'),
    }),
  });

  req.spotifyUser = spotifyUser;
  next();
});
app.use(express.json());
app.use(express.static(resolve(__dirname, '../client/dist')));

const generateRandomString = (N) =>
  (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

MongoClient.connect(process.env.MONGO_STRING)
  .then((client) => {
    console.log('Connected to Database');

    const db = client.db(process.env.DATABASE);
    const usersCollection = db.collection('users');
    const listsCollection = db.collection('lists');

    app.get('/api/login', (_req, res) => {
      const state = generateRandomString(16);
      res.cookie(STATE_KEY, state);
      res.redirect(spotifyApi.createAuthorizeURL(scopes.split(','), state));
    });

    app.get('/api/callback', async (req, res) => {
      if (req.query.state === null) {
        res.redirect('/login');
      }
      const { access_token, refresh_token, expires_in } = (
        await spotifyApi.authorizationCodeGrant(req.query.code)
      ).body;

      const me = await new Spotify({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: access_token,
        refreshToken: refresh_token,
      })
        .getMe()
        .catch((e) => console.log(e));

      const user = {
        userName: me.body.id,
        name: me.body.display_name,
        country: me.body.country,
        image: me.body.images.length ? me.body.images[0].url : '',
      };

      const userId = await usersCollection
        .findOneAndUpdate(
          { userName: user.userName },
          { $set: { ...user } },
          { upsert: true, new: true },
        )
        .then((res) => res.value._id)
        .catch((e) => console.log(e));

      res.redirect(
        `${process.env.DOMAIN}/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}&user=${userId}`,
      );
    });

    app.get('/api/refresh-token', async (req, res) => {
      const data = await req.spotifyUser
        .refreshAccessToken()
        .catch((e) => console.log(e));

      if (data.body) {
        const { access_token, expires_in } = data.body;
        res.json({
          accessToken: access_token,
          expiresIn: expires_in,
        });
      }

      res.sendStatus(401);
    });

    app.get('/api/me', async (req, res) => {
      const me = await req.spotifyUser.getMe().catch((e) => console.log(e));
      res.json(me.body);
    });

    app.get('/api/home', async (req, res) => {
      const retrievedLists = await listsCollection
        .find({
          userId: ObjectId(req.header('user-id')),
        })
        .project({ userId: 0 })
        .toArray();

      const lists = await Promise.all(
        retrievedLists.map(async (list) => {
          const mappedListItems = await Promise.all(
            list.items.map(async (item) => {
              if (item.type === 'show') {
                const latestEpisode = await req.spotifyUser
                  .getShowEpisodes(item.owner?.id, { limit: 1 })
                  .catch((e) => console.log(e));

                item.id = latestEpisode?.body?.items[0]?.id;
                item.name = latestEpisode?.body?.items[0]?.name;
                item.description = latestEpisode?.body?.items[0]?.description;
              }

              return {
                ...item,
              };
            }),
          );

          return {
            ...list,
            items: mappedListItems,
          };
        }),
      );

      res.json({ lists });
    });

    app.get('/api/im-feeling-lucky', async (req, res) => {
      const transfer = await setPlayback(req.spotifyUser).catch((e) =>
        console.log(e),
      );

      if (transfer.status !== 204) {
        res.status(transfer.status).json(transfer.body);
      }

      const recentTracks = await req.spotifyUser
        .getMyRecentlyPlayedTracks({ limit: 5 })
        .catch((e) => console.log(e));
      const recentTrackIds = recentTracks.body.items.map(
        (item) => item.track.id,
      );

      const recommendedTracks = await req.spotifyUser
        .getRecommendations({
          seed_tracks: recentTrackIds.join(','),
          ...req.query,
        })
        .catch((e) => console.log(e));
      const recommendedTrackUris = recommendedTracks.body.tracks.map(
        (track) => track.uri,
      );

      await req.spotifyUser
        .play({ uris: recommendedTrackUris })
        .catch((e) => console.log(e));

      res.send();
    });

    app.patch('/api/lists/:listId', async (req, res) => {
      const mappedItems = await Promise.all(
        req.body?.items?.map(async (item) => {
          if (item.type === 'show') {
            const latestEpisode = await req.spotifyUser
              .getShowEpisodes(item.id, { limit: 1 })
              .catch((e) => console.log(e));

            item.owner = {
              id: item.id,
              name: item.name,
            };
            item.id = latestEpisode?.body?.items[0]?.id;
            item.name = latestEpisode?.body?.items[0]?.name;
            item.description = latestEpisode?.body?.items[0]?.description;
          }

          return { ...item };
        }),
      );

      const mappedList = {
        ...req.body,
        items: mappedItems,
      };

      const updatedList = await listsCollection
        .findOneAndUpdate(
          {
            _id: ObjectId(req.params.listId),
          },
          {
            $set: { ...mappedList },
          },
          {
            returnDocument: 'after',
          },
        )
        .then((res) => res.value)
        .catch((e) => console.log(e));

      res.json(updatedList);
    });

    app.get('/api/search', async (req, res) => {
      const { searchTerm, types } = req.query;
      const limit = Math.round(10 / types?.length);
      const results = await req.spotifyUser
        .search(searchTerm, types, { limit })
        .catch((e) => console.log(e));

      const data = [];
      Object.values(results?.body).map((type) => {
        type.items.map((item) => {
          const owner = {
            id: '',
            name: '',
          };
          let description;

          if (item.type === 'album' || item.type === 'track') {
            owner.id = item.artists[0].id;
            owner.name = item.artists[0].name;
          } else if (item.type === 'playlist') {
            owner.id = item.owner.id;
            owner.name = item.owner.display_name;
          } else if (item.type === 'artist') {
            owner.id = item.id;
            owner.name = item.name;
          }

          if (item.type === 'album') {
            description = `${owner.name}\n${dayjs(item.release_date).format(
              'MMMM D, YYYY',
            )}`;
          } else if (item.type === 'artist') {
            description = `${item.followers?.total?.toLocaleString()} followers`;
          }

          data.push({
            id: item.id,
            name: item.name,
            description: description ?? item.description,
            image: item.images?.length
              ? item.images[0].url
              : item.album?.images
              ? item.album.images[item.album.images.length - 1].url
              : '',
            type: item.type,
            ...(owner.id && {
              owner,
            }),
          });
          return;
        });
        return;
      });

      res.json(data);
    });

    app.get('/api/friends', async (req, res) => {
      const { spDcCookie } = req.query;
      const { accessToken } = await getWebAccessToken(spDcCookie).catch((e) =>
        console.log(e),
      );
      const data = await getFriendActivity(accessToken).catch((e) =>
        console.log(e),
      );
      console.log(data);

      const friendActivity = data.friends.map((friend) => {
        return {
          time:
            Date.now() - friend.timestamp > 900000
              ? dayjs().to(dayjs(friend.timestamp), true)
              : 'online',
          user: {
            name: friend.user.name,
            id: friend.user.uri.slice(friend.user.uri.indexOf('user:') + 5),
          },
          track: {
            name: friend.track.name,
            id: friend.track.uri.slice(friend.track.uri.indexOf('track:') + 6),
            image: friend.track.imageUrl,
            artist: {
              name: friend.track.artist.name,
              id: friend.track.artist.uri.slice(
                friend.track.artist.uri.indexOf('artist:') + 7,
              ),
            },
          },
          context: {
            name: friend.track.context.name,
            id: friend.track.context.uri.slice(
              friend.track.context.uri.indexOf(':', 8),
            ),
            type: friend.track.context.uri.slice(
              friend.track.context.uri.indexOf('spotify:') + 8,
              friend.track.context.uri.indexOf(':', 8),
            ),
          },
        };
      });

      const friends = await Promise.all(
        friendActivity.map(async (friend) => {
          const user = await req.spotifyUser
            .getUser(friend.user.id)
            .catch((e) => console.log(e));

          return {
            ...friend,
            user: {
              ...friend.user,
              image: user.body.images.length ? user.body.images[0].url : '',
            },
          };
        }),
      );

      res.json(friends);
    });

    app.get('*', (_req, res) => {
      res.sendFile(resolve(__dirname, '../client/dist', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
