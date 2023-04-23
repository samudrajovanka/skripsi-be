const { errorRes } = require("../../utils/errorResponse");
const ForbiddenError = require('../../exceptions/ForbiddenError');

const authorization = (rolesAccepted) => (req, res, next) => {
  try {
    const { role = "mahasiswa" } = req.user;

    if (!rolesAccepted.includes(role)) {
      throw new ForbiddenError();
    }

    return next();
  } catch (error) {
    return errorRes(res, error)
  }
}

module.exports = authorization;