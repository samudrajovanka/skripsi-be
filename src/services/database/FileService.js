const FileModel = require("../../api/models/FileModel");
const NotFoundError = require("../../exceptions/NotFoundError");

class FileService {
  async create({ name }) {
    const file = await FileModel.create({ name });

    return file;
  }

  async getAll() {
    const files = await FileModel.find()
      .sort({ createdAt: -1 });

    return files;
  }

  async updateById(id, { name }) {
    await this.checkExistById(id);

    await FileModel.findByIdAndUpdate(id, { name });
  }

  async deleteById(id) {
    await this.checkExistById(id);

    await FileModel.findByIdAndDelete(id);
  }

  async checkExistById(id) {
    const isExist = await FileModel.exists({ _id: id });

    if (!isExist) {
      throw new NotFoundError(`Berkas dengan id '${id}' tidak ditemukan`);
    }
  }
}

module.exports = FileService;
