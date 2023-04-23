const { SERVER_ERR } = require('../constants/errorType');
const ClientError = require('../exceptions/ClientError');

const clientErrRes = (error) => ({
  success: false,
  message: error.message,
  type: error.type
});

const serverErrRes = (error) => ({
  success: false,
  message: error.message,
  type: SERVER_ERR
});

const errorRes = (res, error) => {
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json(clientErrRes(error));
  }

  return res.status(500).json(serverErrRes(error));
};

module.exports = {
  errorRes,
  clientErrRes,
  serverErrRes
}