const BeasiswaModel = require('../../api/models/BeasiswaModel');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const MahasiswaService = require('./MahasiswaService');
const PesertaService = require('./PesertaService');
const FirebaseStorageService = require('../firebase/StorageService');
const SurveyService = require('./SurveyService');
const UserService = require('./UserService');

class BeasiswaService {
  async getAll() {
    const beasiswa = await BeasiswaModel.find()
      .sort({ createdAt: -1 });

    return beasiswa;
  }

  async getByMahasiswa(mahasiswaId) {
    const mahasiswaService = new MahasiswaService();

    await mahasiswaService.checkExistById(mahasiswaId);

    const pesertaService = new PesertaService();

    const beasiswa = await pesertaService.getBeasiswaByMahasiswaId(mahasiswaId);

    return beasiswa;
  }

  async getByVerifikator(username, id) {
    const userService = new UserService();

    await userService.checkExistByUsername(username);

    const surveyService = new SurveyService();

    const beasiswa = await surveyService.getBeasiswaByVerifikatorId(id);

    return beasiswa;
  }

  async getById(id) {
    const beasiswa = await BeasiswaModel.findById(id);

    if (!beasiswa) {
      throw new NotFoundError('Beasiswa tidak ditemukan');
    }

    return beasiswa;
  }

  async create({ name, year, quota, openDate, closeDate, status }) {
    const beasiswa = await BeasiswaModel.create({
      name, year, quota, openDate, closeDate, status
    });

    return beasiswa;
  }

  async update(id, { name, year, quota, openDate, closeDate, status }) {
    await this.checkExistById(id);

    const beasiswa = await BeasiswaModel.findByIdAndUpdate(id, {
      name, year, quota, openDate, closeDate, status
    }, { new: true });

    return beasiswa;
  }

  async delete(id) {
    await this.checkExistById(id);

    await BeasiswaModel.findByIdAndDelete(id);

    const pesertaService = new PesertaService();

    await pesertaService.deleteManyByBeasiswaId(id);
  }

  async checkExistById(id) {
    const isExist = await BeasiswaModel.exists({ _id: id });

    if (!isExist) {
      throw new NotFoundError(`Beasiswa dengan id '${id}' tidak ditemukan`);
    }
  }

  async checkClosedBeasiswa(id) {
    const beasiswa = await this.getById(id);

    if (beasiswa.status === 'tutup') {
      throw new InvariantError(`Beasiswa dengan id '${id}' sudah ditutup`);
    }
  }

  async getParticipantsByBeasiswaId(beasiswaId) {
    await this.checkExistById(beasiswaId);
    
    const pesertaService = new PesertaService();

    const participants = await pesertaService.getByBeasiswaId(beasiswaId);

    return participants;
  }

  async addParticipantExistMahasiswa(beasiswaId, { mahasiswaId, mahasiswaNim }) {
    await this.checkExistById(beasiswaId);
    await this.checkClosedBeasiswa(beasiswaId);

    const pesertaService = new PesertaService();

    await pesertaService.checkParticipantExist(mahasiswaNim, beasiswaId);

    await pesertaService.create({
      beasiswaId,
      mahasiswaId
    });
  }

  async addParticipantNewMahasiswa(beasiswaId, { name, nim, password }) {
    await this.checkExistById(beasiswaId);
    await this.checkClosedBeasiswa(beasiswaId);

    const mahasiswaService = new MahasiswaService();

    const mahasiswa = await mahasiswaService.create({
      name,
      nim,
      password
    });

    const pesertaService = new PesertaService();

    await pesertaService.create({
      beasiswaId,
      mahasiswaId: mahasiswa._id
    });
  }

  async deleteParticipant(beasiswaId, username) {
    await this.checkExistById(beasiswaId);

    const pesertaService = new PesertaService();

    await pesertaService.deleteParticipantBeasiswa(beasiswaId, username);
  }

  async uploadFile(beasiswaId, mahasiswaId, file, berkasId) {
    await this.checkExistById(beasiswaId);
    await this.checkClosedBeasiswa(beasiswaId);

    // upload file to firebase
    const firebaseStorageService = new FirebaseStorageService();
    const { url, fileName } = await firebaseStorageService.uploadFile(
      file,
      { folderName: `${beasiswaId}/${mahasiswaId}` }
    );

    const pesertaService = new PesertaService();

    const fileData = {
      berkasId,
      url,
      name: fileName
    }

    await pesertaService.addFileToParticipant(beasiswaId, mahasiswaId, fileData);
  }

  async addVerifikatorToMahasiswa({ username, usernameVerifikator, beasiswaId }) {
    await this.checkExistById(beasiswaId);

    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(username);

    const surveyService = new SurveyService();
    await surveyService.add({
      mahasiswaId: mahasiswa.id,
      usernameVerifikator,
      beasiswaId
    });
  }

  async verifikatorGiveScore(username, idVerifikator, beasiswaId, { score }) {
    await this.checkExistById(beasiswaId);

    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(username);

    const surveyService = new SurveyService();
    await surveyService.giveScore(
      mahasiswa.id,
      idVerifikator,
      beasiswaId,
      { score }
    );
  }

  async deleteVerifikatorSurvey(verifikatorId, username, beasiswaId) {
    await this.checkExistById(beasiswaId);

    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(username);

    const surveyService = new SurveyService();
    await surveyService.deleteVerifikatorSurvey(
      verifikatorId,
      mahasiswa.id,
      beasiswaId
    );
  }
}

module.exports = BeasiswaService;
