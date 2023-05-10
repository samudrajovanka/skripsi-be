const BeasiswaModel = require('../../api/models/BeasiswaModel');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const MahasiswaService = require('./MahasiswaService');
const PesertaService = require('./PesertaService');
const FirebaseStorageService = require('../firebase/FirebaseStorageService');
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

    const pesertaService = new PesertaService();
    const totalParticipants = await pesertaService.countPaticipantByBeasiswaId(id);
    
    const beasiswaWithParticipantsLength = {
      ...beasiswa.toJSON(),
      totalParticipants
    };

    return beasiswaWithParticipantsLength;
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

    const surveyService = new SurveyService();
    await surveyService.deleteManyByBeasiswaId(id);
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

  async getParticipantsByBeasiswaIdVerifiktor(beasiswaId, verifikatorId) {
    await this.checkExistById(beasiswaId);

    const pesertaService = new PesertaService();
    const participants = await pesertaService.getByBeasiswaId(beasiswaId);

    const surveyService = new SurveyService();
    const mahasiswaId = await surveyService.getMahasiswaIdByVerifikatorId(beasiswaId, verifikatorId);

    const participantsByVerifikator = participants.filter((participant) => (
      mahasiswaId.includes(participant.mahasiswa.id)
    ));

    return participantsByVerifikator;
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

    const beasiswa = await this.getById(beasiswaId);
    if (beasiswa.isLocked) {
      throw new InvariantError('Beasiswa sudah dikunci, tidak bisa memberikan nilai');
    }

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

  async updateLockBeasiswa(beasiswaId, { isLock }) {
    await this.checkExistById(beasiswaId);

    await BeasiswaModel.updateOne(
      { _id: beasiswaId },
      { isLocked: isLock }
    );
  }

  calculationCertaintyFactorScore(...cf) {
    const result = cf.reduce((result, value, index) => {
      if (index === 1) return result;

      const cfOld = index === 0 ? value : result;
      const cfNext = index === 0 ? cf[1] : value;

      if (cfOld > 0 && cfNext > 0) {
        // console.log(`${cfOld} + ${cfNext} * (1 - ${cfOld}) => ${cfOld + (cfNext * (1 - cfOld))}`);
        return cfOld + (cfNext * (1 - cfOld));
      } else if ((cfOld > 0 && cfNext < 0) || (cfOld < 0 && cfNext > 0)) {
        // console.log(`(${cfOld} + ${cfNext})/(1-Math.min(${Math.abs(cfOld)}, ${Math.abs(cfNext)})) => ${(cfOld + cfNext)/(1-Math.min(Math.abs(cfOld), Math.abs(cfNext)))}`);
        return (cfOld + cfNext)/(1-Math.min(Math.abs(cfOld), Math.abs(cfNext)));
      } else {
        // console.log(`${cfOld} + ${cfNext} * (1 + ${cfOld}) => ${cfOld + (cfNext * (1 + cfOld))}`);
        return cfOld + (cfNext * (1 + cfOld))
      }
    }, 0);

    return result;
  }

  async seleksi(beasiswaId) {
    const beasiswa = await this.getById(beasiswaId);

    if (!beasiswa.isLocked) {
      throw new InvariantError('Beasiswa belum dikunci, tidak bisa melakukan seleksi');
    }

    const pesertaService = new PesertaService();
    const peserta = await pesertaService.getByBeasiswaId(beasiswaId);
    
    const surveyService = new SurveyService();
    const cfAverageSurvey = await surveyService.getCFAverageSurvey(beasiswaId);

    const result = peserta.map((item) => {
      const cf = item.data.map((parameter) => parameter.certaintyValue);
      cf.push(cfAverageSurvey[item.mahasiswa.id].cf ?? -1);

      const cfScore = this.calculationCertaintyFactorScore(...cf);

      return {
        mahasiswa: item.mahasiswa,
        value: cfScore.toFixed(4)
      }
    })
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      status: index <= beasiswa.quota
        ? item.value > 0.2 ? "diterima" : "ditolak"
        : "ditolak"
    }));

    return result;
  }

  async seleksiAndSave(beasiswaId) {
    const seleksiResult = await this.seleksi(beasiswaId);

    const finalSeleksiResult = seleksiResult.map((item) => ({
      ...item,
      mahasiswa: item.mahasiswa.id
    }));

    await BeasiswaModel.updateOne(
      { _id: beasiswaId },
      { result: finalSeleksiResult }
    );
  }

  async getBeasiswaResult(beasiswaId) {
    await this.checkExistById(beasiswaId);

    const beasiswa = await BeasiswaModel.findById(beasiswaId)
      .populate({
        path: 'result.mahasiswa',
        select: '-password'
      });

    return beasiswa.result;
  }
}

module.exports = BeasiswaService;
