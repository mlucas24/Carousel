const server = require('./server');
const ENV = require('../config');

const PORT = process.env.PORT || ENV.serverPort;

server.listen(PORT, () => {
  console.log(`Carousels Service listening on port ${PORT}`);
});
