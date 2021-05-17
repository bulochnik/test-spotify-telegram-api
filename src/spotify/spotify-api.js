const SpotifyWebApi = require('spotify-web-api-node');

const { CLIENT_ID, CLIENT_SECRET } = require('../constants');

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:4001/api/callback',
  CLIENT_ID,
  CLIENT_SECRET
});

const login = async (request, response) => {
  try {
    response.redirect(spotifyApi.createAuthorizeURL(scopes));
  } catch (error) {
    console.log(error)
  }
};

const callback = async (request, response) => {
  const error = request.query.error;
  const code = request.query.code;
  const state = request.query.state;

  if (error) {
    console.error('Callback Error:', error);
    response.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      response.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      response.send(`Error getting Tokens: ${error}`);
    });
};

const test = async (request, response) => {
  response.send('Hulahup from test');
  console.log('Hulahup from test');
};


module.exports = { 
  login,
  callback,
  test
};
