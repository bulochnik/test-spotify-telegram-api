const { server, app } = require('./app');
const { SERVER_URL, SERVER_PORT } = require('./constants');

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://${ SERVER_URL }:${ SERVER_PORT }`);
  server.on('error', () => console.log('\n\n\n\n\n\n\nERROR\n\n\n\n\n\n\n'))
});
