module.exports = {
  

  logStart() {
    console.log('Telegram bot connected')
  },
  
  getChatId(message) {
    return message.chat.id;
  },

  getItemId(source) {
    return source.substr(2, source.length)
  }
}
