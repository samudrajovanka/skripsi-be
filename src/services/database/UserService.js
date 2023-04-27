const bcrypt = require('bcrypt');

const UserModel = require('../../api/models/UserModel');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserService {
  async create({ name, username, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = UserModel({
      name,
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    return newUser;
  }

  async getAll() {
    const users = await UserModel.find()
      .select('-password')
      .sort({ createdAt: -1 })

    return users;
  }

  async getByUsername(username) {
    const user = await UserModel.findOne({ username })
      .select('-password');

    if(!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return user;
  }

  async updateByUsername(username, { name, username: usernameUpdate, role }) {
    await this.checkExistByUsername(username);

    const user = await UserModel.findOneAndUpdate(
      { username },
      {
        name,
        username: usernameUpdate,
        role
      }
    );

    return user;
  }

  async deleteByUsername(username) {
    await this.checkExistByUsername(username);

    await UserModel.findOneAndDelete({ username });
  }

  async checkExistByUsername(username) {
    const isExist = await UserModel.exists({ username });

    if (!isExist) {
      throw new NotFoundError(`User dengan username '${username}' tidak ditemukan`);
    }
  }
}

module.exports = UserService;
