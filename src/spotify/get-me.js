const mongoose = require('mongoose');
const SpotifyWebApi = require('spotify-web-api-node');

const { SPOTIFY_TOKEN, DB_URL } = require('../constants');

require('../models/playlist.model');
require('../models/track.model');

const Playlist = mongoose.model('playlist');
const Track = mongoose.model('track');

// mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(error => console.log(error))

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(SPOTIFY_TOKEN);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
};

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)
  let playlist = data.body.items

  playlist.forEach(f => new Playlist(f).save().catch(e => console.log(e)))

  for (let playlist of data.body.items) {
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);

    tracks.forEach(f => new Track(f).save().catch(e => console.log(e)))
  }
};

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 1,
    fields: 'items'
  })

  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
  }
  
  return tracks;
};

const getData = async (request, response) => {
  getMyData();
  response.send('Success! Data have been extracted !');
  console.log('Success! Data have been extracted !');
};


module.exports = {
  getData
};
