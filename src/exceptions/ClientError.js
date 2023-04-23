const { CLIENT_ERR_MSG } = require ('../constants/errorMessage');
const { CLIENT_ERR } = require ('../constants/errorType');

class ClientError extends Error {
  statusCode;
  type;

  constructor(message = CLIENT_ERR_MSG, type = CLIENT_ERR, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}

module.exports = ClientError;
