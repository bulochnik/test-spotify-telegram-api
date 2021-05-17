const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PlaylistSchema = new Schema ({
  collaborative: {
    type: Boolean,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  external_urls: {
    type: Schema.Types.Mixed,
    required: false
  },
  href: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  images: {
    type: Schema.Types.Mixed,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.Mixed,
    required: false
  },
  primary_color: {
    type: Schema.Types.Mixed,
    required: false
  },
  public: {
    type: Boolean,
    required: false
  },
  snapshot_id: {
    type: String,
    required: false
  },
  tracks: {
    type: Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  uri: {
    type: String,
    required: true
  }
})

mongoose.model('playlist', PlaylistSchema)
