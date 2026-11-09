const server = require('../server');

module.exports = (req, res) => {
  return server.emit('request', req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
