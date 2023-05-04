const FirebaseStorageService = require("../firebase/FirebaseStorageService");
const PengumumanModel = require('../../api/models/pengumumanModel');
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class PengumumanService {
  async checkExistPengumumanById(id) {
    const isExist = await PengumumanModel.exists({ _id: id });

    if (!isExist) {
      throw new NotFoundError(`Pengumuman dengan id '${id}' tidak ditemukan`);
    }
  }

  async create({ title, content, files, isActive }) {
    if (files.length > 3) {
      throw new InvariantError('Maksimal 3 file');
    }

    let filesUploaded = [];
    if (files.length) {
      const firebaseStorageService = new FirebaseStorageService();
      filesUploaded = (await firebaseStorageService.uploadFiles(
        files,
        { folderName: 'pengumuman' }
      ))
        .map((fileUploaded) => ({
          url: fileUploaded.url,
          name: fileUploaded.fileName
        }));
    }

    const contentWithBreak = content.replace(/\n/g, '<br>');

    const newPengumuman = PengumumanModel({
      title,
      content: contentWithBreak,
      files: filesUploaded,
      isActive
    });

    await newPengumuman.save();

    return newPengumuman;
  }

  async getAll({ isActive }) {
    const pengumuman = await PengumumanModel.find({
      isActive: isActive === undefined ? { $ne: null } : isActive
    });

    return pengumuman;
  }

  async getById(id) {
    await this.checkExistPengumumanById(id);

    const pengumuman = await PengumumanModel.findById(id);

    return pengumuman;
  }

  async delete(id) {
    await this.checkExistPengumumanById(id);

    const pengumuman = await PengumumanModel.findByIdAndDelete(id);

    return pengumuman;
  }

  async updateById(id, { title, content, files, oldFiles, isActive }) {
    await this.checkExistPengumumanById(id);

    const oldFilesArray = oldFiles ?? [];

    const totalFiles = oldFilesArray.length + files.length;
    if (totalFiles > 3) {
      throw new InvariantError('Maksimal 3 file');
    }

    let filesUploaded = [];

    if (files.length) {
      const firebaseStorageService = new FirebaseStorageService();
      filesUploaded = (await firebaseStorageService.uploadFiles(
        files,
        { folderName: 'pengumuman' }
      ))
        .map((fileUploaded) => ({
          url: fileUploaded.url,
          name: fileUploaded.fileName
        }));
    }

    const contentWithBreak = content.replace(/\n/g, '<br>');

    await PengumumanModel.findByIdAndUpdate(id, {
      title,
      content: contentWithBreak,
      files: [...oldFilesArray, ...filesUploaded],
      isActive
    });
  }
}

module.exports = PengumumanService;
