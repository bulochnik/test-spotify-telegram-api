const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TrackSchema = new Schema ({
  album: {
    type: Schema.Types.Mixed,
    required: false
  },
  artists: {
    type: Schema.Types.Mixed,
    required: false
  },
  available_markets: {
    type: Schema.Types.Mixed,
    required: false
  },
  disc_number: {
    type: Number,
    required: false
  },
  duration_ms: {
    type: Number,
    required: false
  },
  episode: {
    type: Boolean,
    required: false
  },
  explicit: {
    type: Boolean,
    required: false
  },
  external_ids: {
    type: Schema.Types.Mixed,
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
  is_local: {
    type: Boolean,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    required: false
  },
  preview_url: {
    type: String,
    requiree: false
  },
  track_number: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  uri: {
    type: String,
    required: false
  }
})

mongoose.model('track', TrackSchema)
