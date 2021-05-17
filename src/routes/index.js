const { Router } = require('express');

const { spotifyApi } = require('../spotify');
const { getSpotifyData } = require('../spotify');

const router = new Router();

router.get('/login', spotifyApi.login);
router.get('/callback', spotifyApi.callback);
router.get('/test', spotifyApi.test);

router.get('/getdata', getSpotifyData.getData);

module.exports = router;
