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
  const { access_token, refresh_token, expires_in } = (
    await req.spotifyUser.refreshAccessToken()
  ).body;

  res.json({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresIn: expires_in,
  });
});

app.get('/api/me', async (req, res) => {
  const me = await req.spotifyUser.getMe().catch((e) => console.log(e));
  res.json(me.body);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
