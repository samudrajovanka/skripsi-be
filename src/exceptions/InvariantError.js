const { INVARIANT_ERR_MSG } = require('../constants/errorMessage');
const { INVARIANT_ERR } = require('../constants/errorType');

const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  name;

  constructor(message = INVARIANT_ERR_MSG, type = INVARIANT_ERR, code = 400) {
    super(message, type, code);
    this.name = 'Invariant Error';
  }
}

module.exports = InvariantError;
