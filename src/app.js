const mongoose = require('mongoose');
const express = require('express');
const http = require('http');

const { DB_URL } = require('./constants')
const router = require('./routes');
const bot = require('./telegram');

const app = express();
const server = http.createServer(app);

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error))

app.use('/', (request, response, next) => {
  next();
});

app.use('/api', router);

module.exports = { server, app }
