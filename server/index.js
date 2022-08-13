const Spotify = require('spotify-web-api-node');
const path = require('path');
const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
    'Origin, X-Requested-With, Content-Type, Accept, Access-Token, Refresh-Token, Expiry-Date',
  );

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
app.use(express.static(path.resolve(__dirname, '../client/dist')));

const generateRandomString = (N) =>
  (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

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
  res.redirect(
    `${process.env.DOMAIN}/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`,
  );
});

app.get('/api/refresh-token', async (req, res) => {
  const data = await req.spotifyUser
    .refreshAccessToken()
    .catch((e) => console.log(e));

  const { access_token, expires_in } = data.body;

  res.json({
    accessToken: access_token,
    expiresIn: expires_in,
  });
});

app.get('/api/me', async (req, res) => {
  const me = await req.spotifyUser.getMe().catch((e) => console.log(e));
  res.json(me.body);
});

app.get('/api/im-feeling-lucky', async (req, res) => {
  const devices = await req.spotifyUser
    .getMyDevices()
    .catch((e) => console.log(e));

  if (devices.body.devices.length === 0) {
    res
      .status(400)
      .json({ title: 'Could not play', message: 'No devices found' });
    return;
  }

  const playback = await req.spotifyUser
    .getMyCurrentPlaybackState()
    .catch((e) => console.log(e));

  if (playback.statusCode === 204) {
    if (devices.body.devices.length === 1) {
      await req.spotifyUser
        .transferMyPlayback([devices.body.devices[0].id])
        .catch((e) => console.log(e));
    }
  }

  const recentTracks = await req.spotifyUser
    .getMyRecentlyPlayedTracks({ limit: 5 })
    .catch((e) => console.log(e));
  const recentTrackIds = recentTracks.body.items.map((item) => item.track.id);

  const recommendedTracks = await req.spotifyUser
    .getRecommendations({
      seed_tracks: recentTrackIds.join(','),
      ...req.query,
    })
    .catch((e) => console.log(e));
  const recommendedTrackUris = recommendedTracks.body.tracks.map(
    (track) => track.uri,
  );

  await req.spotifyUser.play({ uris: recommendedTrackUris });

  res.send();
});

app.get('/api/search', async (req, res) => {
  const { searchTerm, types } = req.query;
  const limit = Math.round(10 / types?.length);
  const results = await req.spotifyUser
    .search(searchTerm, types, { limit })
    .catch((e) => console.log(e));

  const data = [];
  Object.values(results.body).map((type) => {
    type.items.map((item) => {
      data.push({
        id: item.id,
        name: item.name,
        image: item.images?.length
          ? item.images[item.images.length - 1].url
          : item.album?.images
          ? item.album.images[item.album.images.length - 1].url
          : '',
        type: item.type,
      });
      return;
    });
    return;
  });

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
