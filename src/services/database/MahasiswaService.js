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
    const users = await MahasiswaModel.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return users;
  }

  async getByUsername(username) {
    const user = await MahasiswaModel.findOne({ username })
      .select('-password');

    if(!user) {
      throw new NotFoundError('Mahasiswa tidak ditemukan');
    }

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
}

module.exports = MahasiswaService;
