const keyboardButtons = require('./keyboard-buttons');

module.exports = {
  home: [
    [keyboardButtons.home.playlists, keyboardButtons.home.favourites]
  ],
  playlists: [
    [keyboardButtons.playlist.random, keyboardButtons.playlist.new],
    [keyboardButtons.playlist.rock],
    [keyboardButtons.back]
  ]
}
