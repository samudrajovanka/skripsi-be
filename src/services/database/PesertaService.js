const PesertaModel = require("../../api/models/PesertaModel");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PesertaService {
  async checkParticipantExist(username, beasiswaId) {
    const participantOnScholarship = await PesertaModel.find({
      beasiswa: beasiswaId,
    }).populate("mahasiswa");

    const isExist = participantOnScholarship.find(
      (participant) => participant.mahasiswa.username === username
    );

    if (isExist) {
      throw new InvariantError('Peserta sudah terdaftar');
    }
  }

  async create({ beasiswaId, mahasiswaId }) {
    const participant = await PesertaModel({
      beasiswa: beasiswaId,
      mahasiswa: mahasiswaId,
    });

    await participant.save();

    return participant;
  }

  async getByBeasiswaId(beasiswaId) {
    const participants = await PesertaModel.find({ beasiswa: beasiswaId });

    return participants;
  }

  async deleteManyByBeasiswaId(beasiswaId) {
    await PesertaModel.deleteMany({ beasiswa: beasiswaId });
  }

  async deleteParticipantBeasiswa(beasiswaId, username) {
    const participant = await this.getParticipantByUsername(beasiswaId, username);

    await PesertaModel.findOneAndDelete({ beasiswa: beasiswaId, mahasiswa: participant.mahasiswa._id });
  }

  async getParticipantByUsername(beasiswaId, username) {
    const participant = await PesertaModel.findOne({ beasiswa: beasiswaId })
      .populate('mahasiswa');

    if (!participant) {
      throw new NotFoundError('Peserta tidak ditemukan');
    }

    if (participant.mahasiswa.username !== username) {
      throw new NotFoundError('Peserta tidak ditemukan');
    }

    return participant;
  }

  async getBeasiswaByMahasiswaId(mahasiswaId) {
    const beasiswaRaw = await PesertaModel.find({ mahasiswa: mahasiswaId })
      .populate("beasiswa")
      .select("beasiswa");

    const beasiswa = beasiswaRaw.map((item) => item.beasiswa)
      .sort((a, b) => b.createdAt - a.createdAt);

    return beasiswa;
  }

  async addFileToParticipant(beasiswaId, mahasiswaId, data) {
    const participant = await PesertaModel.findOne({
      beasiswa: beasiswaId,
      mahasiswa: mahasiswaId,
    });

    if (!participant) {
      throw new NotFoundError('Peserta tidak ditemukan');
    }

    const oldFilterData = participant.data.filter((item) => item.kriteria != data.kriteriaId);

    const newData = {
      kriteria: data.kriteriaId,
      file: {
        name: data.file.name,
        url: data.file.url,
      },
    };

    participant.data = [...oldFilterData, newData];

    await participant.save();
  }
};

module.exports = PesertaService;
