const Spotify = require('spotify-web-api-node');
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
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000'); // update to match the domain you will make the request from
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

const generateRandomString = (N) =>
  (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

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
    `http://localhost:8000/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`,
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
