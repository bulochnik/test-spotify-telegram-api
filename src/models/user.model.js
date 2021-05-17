const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema ({
  id: {
    type: Number,
    require: true
  },
  playlists: {
    type: [String],
    default: []
  }
})

mongoose.model('users', UserSchema)
