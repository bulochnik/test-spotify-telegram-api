const fs = require('fs');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN } = require('../constants');
const helper = require('./helper');
const keyboard = require('./keyboard');
const keyboardButtons = require('./keyboard-buttons');

helper.logStart();

require('../models/playlist.model');
// require('../models/track.model');
require('../models/user.model');

const Playlist = mongoose.model('playlist');
// const Track = mongoose.model('track');
const User = mongoose.model('users');

const ACTION_TYPE = {
  TOGGLE_FAV_PLAYLIST: 'tfp',
}

const bot = new TelegramBot(TELEGRAM_TOKEN, {
  polling: true
});

bot.on('message', message => {
  console.log(`Message from ${message.from.first_name}`);

  const chatId = helper.getChatId(message);
  
  switch (message.text) {
    case keyboardButtons.home.playlists:
      bot.sendMessage(chatId, `Выберите жанр:`, {
        reply_markup: {keyboard: keyboard.playlists}
      })
      break
    case keyboardButtons.playlist.random:
      sendPlaylistsByQuery(chatId, {});
      break
    case keyboardButtons.playlist.new:
      sendPlaylistsByQuery(chatId, {});
      break
    case keyboardButtons.playlist.rock:
      sendPlaylistsByQuery(chatId, {});
      break

    case keyboardButtons.home.favourites:
      showFavouritePlaylists(chatId, message.from.id)
      break

    case keyboardButtons.back:
      bot.sendMessage(chatId, `Что хотите послушать ?`, {
        reply_markup: {keyboard: keyboard.home}
      })
      break 
  }
});

bot.onText(/\/start/, message => {
  const { first_name } = message.from
  const hello = `Здравствуйте, ${first_name}\nЧто хотите послушать ?`
  
  bot.sendMessage(helper.getChatId(message), hello, {
    reply_markup: {
      keyboard: keyboard.home
    }
  })
});

bot.onText(/\/p(.+)/, (message, [source, match]) => {

  const playlistId = helper.getItemId(source);
  const chatId = helper.getChatId(message);

  Promise.all([
    Playlist.findOne({id: playlistId}),
    User.findOne({id: message.from.id})
  ]).then(([playlist, user]) => {

    let isFav = false

    if (user) {
      isFav = user.playlists.indexOf(playlistId) !== -1
    }

    const favText = isFav ? 'Удалить из избранного' : 'Добавить в избранное'

    const data = playlist.external_urls.spotify

    bot.sendMessage(chatId, data, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Слушать',
              url: data
            },
            {
              text: favText,
              callback_data: JSON.stringify({
                type: ACTION_TYPE.TOGGLE_FAV_PLAYLIST,
                id: playlistId,
                isFav: isFav
              })
            }
          ]
        ]
      }
    })
  })
});

bot.on('callback_query', query => {
  const user = query.from
  let data
  try {
    data = JSON.parse(query.data)
  } catch (error) {
    throw new Error('Data is not an object')
  }

  const { type } = data

  if (type === ACTION_TYPE.TOGGLE_FAV_PLAYLIST) {
    toggleFavouritePlaylist(user, query.id, data)
  }
});

bot.on('inline_query', query => {
  Playlist.find({}).then(playlists => {
    const results = playlists.map(p => {
      const caption = `Название: ${p.name}\nКоличество треков: ${p.tracks.total}`
      return {
        id: p.id,
        type: 'photo',
        photo_url: p.images[0].url,
        thumb_url: p.images[0].url,
        caption: caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Слушать ${p.name}`,
                url: p.external_urls.spotify
              }
            ]
          ]
        }
      }
    })

    bot.answerInlineQuery(query.id, results, {
      cache_time: 0
    })
  })
});

function sendPlaylistsByQuery(chatId, query) {
  Playlist.find(query).then(playlists => {
    const html = playlists.map((p, i) => {
      return `<b>${i + 1}</b> ${p.name} - /p${p.id}`
    }).join('\n')

    sendHTML(chatId, html, 'playlists');
  })
}

function sendHTML(chatId, html, kbName = null) {
  const options = {
    parse_mode: 'HTML'
  }

  if (kbName) {
    options['reply_markup'] = {
      keyboard: keyboard[kbName]
    }
  }

  bot.sendMessage(chatId, html, options)
}

function toggleFavouritePlaylist (user, queryId, {id, isFav}) {
  console.log(user)
  const userId = user.id
  const playlistId = id

  let userPromise

  User.findOne({id: userId})
    .then(user => {
      if (user) {
        if (isFav) {
          user.playlists = user.playlists.filter(pId => pId !== playlistId)
        } else {
          user.playlists.push(playlistId)
        }
        userPromise = user
      } else {
        userPromise = new User({
          id: userId,
          playlist: [playlistId]
        })
      }

      const answerText = isFav ? 'Удалено' : 'Добавлено'

      userPromise.save().then(_ => {
        bot.answerCallbackQuery(queryId, {text: answerText})
      }).catch(error => console.log(error))
    }).catch(error => console.log(error))
}

function showFavouritePlaylists(chatId, userId) {

  User.findOne({id: userId})
    .then(user => {

      if (user) {
        Playlist.find({id: {'$in': user.playlists}}).then(playlists => {
          let html

          if (playlists.length) {
            html = playlists.map((p, i) => {
              return `<b>${i + 1}</b> ${p.name} (/p${p.id})`
            }).join('\n')
          } else {
            html = 'Вы пока ничего не добавили'
          }

          sendHTML(chatId, html, 'home')
        }).catch(error => console.log(error))
      } else {
        sendHTML(chatId, 'Вы пока ничего не добавили', 'home')
      }
      
    }).catch(erroe => console.log(error))
}
