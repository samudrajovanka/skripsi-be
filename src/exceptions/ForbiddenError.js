const { FORBIDDEN_ERR_MSG } = require('../constants/errorMessage');
const { FORBIDDEN_ERR } = require('../constants/errorType');

const ClientError = require('./ClientError');

class ForbiddenError extends ClientError {
  name;

  constructor(message = FORBIDDEN_ERR_MSG, type = FORBIDDEN_ERR) {
    super(message, type, 403);
    this.name = 'Forbidden Error';
  }
}

module.exports = ForbiddenError;
