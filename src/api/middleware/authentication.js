const config = require('../../config');
const AuthenticationError = require('../../exceptions/Authentication');
const MahasiswaService = require('../../services/database/MahasiswaService');
const UserService = require('../../services/database/UserService');
const { errorRes } = require('../../utils/errorResponse');
const { decodeToken } = require('../../utils/tokenManager');

const authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers?.authorization;

    if (!bearerToken) {
      throw new AuthenticationError()
    }

    const token = bearerToken.split(' ')[1];

    const { username, role } = await decodeToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    let user = null;

    if (!config.USER_ROLE.includes(role) && role === "mahasiswa") {
      const mahasiswaService = new MahasiswaService();

      user = await mahasiswaService.getByUsername(username);

      req.user = user;
      return next();
    }

    const userService = new UserService();
    user = await userService.getByUsername(username);

    req.user = user;
    return next();
  } catch (error) {
    errorRes(res, error)
  }
};

module.exports = authentication;
