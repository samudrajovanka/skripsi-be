const bcrypt = require('bcrypt');

const MahasiswaModel = require('../../api/models/MahasiswaModel');
const NotFoundError = require('../../exceptions/NotFoundError');

class MahasiswaService {
  async create({ name, password, nim }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = MahasiswaModel({
      name,
      username: nim,
      password: hashedPassword,
      nim
    });

    await newUser.save();

    return newUser;
  }

  async getAll() {
    const usersRaw = await MahasiswaModel.find()
      .sort({ createdAt: -1 });

    const users = usersRaw.map(this.#removePassword);

    return users;
  }

  async getByUsername(username) {
    const userRaw = await MahasiswaModel.findOne({ username });

    if(!userRaw) {
      throw new NotFoundError('Mahasiswa tidak ditemukan');
    }

    const user = this.#removePassword(userRaw);

    return user;
  }

  async updateByUsername(username, { name }) {
    await this.checkExistByUsername(username);

    const user = await MahasiswaModel.findOneAndUpdate(
      { username },
      {
        name
      }
    );

    return user;
  }

  async deleteByUsername(username) {
    await this.checkExistByUsername(username);

    await MahasiswaModel.findOneAndDelete({ username });
  }

  async checkExistByUsername(username) {
    const isExist = await MahasiswaModel.exists({ username });

    if (!isExist) {
      throw new NotFoundError(`Mahasiswa dengan username '${username}' tidak ditemukan`);
    }
  }

  async checkExistById(id) {
    const isExist = await MahasiswaModel.exists({ _id: id });

    if (!isExist) {
      throw new NotFoundError(`Mahasiswa dengan id '${id}' tidak ditemukan`);
    }
  }

  #removePassword(user) {
    const userJson = user.toJSON();
    delete userJson.password;

    return userJson;
  }
}

module.exports = MahasiswaService;
