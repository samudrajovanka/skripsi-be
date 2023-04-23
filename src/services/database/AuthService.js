const bcrypt = require('bcrypt');

const MahasiswaModel = require('../../api/models/MahasiswaModel');
const UserModel = require('../../api/models/UserModel');
const AuthenticationError = require('../../exceptions/Authentication');
const { createToken } = require('../../utils/tokenManager');

class AuthService {
  #LOGIN_EXPIRES_IN = '7d';

  async login(loginAs, { username, password }) {
    switch(loginAs) {
      case 'mahasiswa':
        return await this.#loginMahasiswa({ username, password });
      default:
        return await this.#loginUser({ username, password });
    }
  }

  async #loginMahasiswa({ username, password }) {
    const user = await MahasiswaModel.findOne({ username });

    if (!user) {
      throw new AuthenticationError('Username atau password salah');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) AuthenticationError('Username atau password salah');

    const payload = {
      id: user._id,
      username: user.username,
      role: 'mahasiswa'
    };

    const accessToken = this.#createAccessToken(payload);

    return `Bearer ${accessToken}`;
  }

  async #loginUser({ username, password }) {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new AuthenticationError('Username atau password salah')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) AuthenticationError('Username atau password salah');

    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    const accessToken = this.#createAccessToken(payload);

    return `Bearer ${accessToken}`;
  }

  #createAccessToken(payload) {
    const accessToken = createToken({
      payload,
      secret: process.env.ACCESS_TOKEN_SECRET,
      options: {
        expiresIn: this.#LOGIN_EXPIRES_IN
      }
    });

    return accessToken;
  }
}

module.exports = AuthService;
