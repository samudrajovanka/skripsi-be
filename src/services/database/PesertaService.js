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
    const participants = await PesertaModel.find({ beasiswa: beasiswaId })
      // .sort({ createdAt: -1 })
      .populate({
        path: 'mahasiswa',
        select: '-password',
        // options: { sort: { nim: -1 } }
      })
      .populate('data')
      .select('-beasiswa')

    const participantsSortedByNim = participants.sort((a, b) => +a.mahasiswa.nim - +b.mahasiswa.nim);

    return participantsSortedByNim;
  }

  async deleteManyByBeasiswaId(beasiswaId) {
    await PesertaModel.deleteMany({ beasiswa: beasiswaId });
  }

  async deleteParticipantBeasiswa(beasiswaId, username) {
    const participant = await this.getParticipantByUsername(beasiswaId, username);

    await PesertaModel.findOneAndDelete({ beasiswa: beasiswaId, mahasiswa: participant.mahasiswa._id });
  }

  async getParticipantByUsername(beasiswaId, username) {
    const participantOnScholarship = await PesertaModel.find({
      beasiswa: beasiswaId,
    })
    .populate({
      path: 'mahasiswa',
      select: '-password'
    })
    .populate({
      path: 'files',
      populate: {
        path: 'berkas',
        model: 'File'
      }
    })
    .populate('data')
    .select('-beasiswa');


    const participant = participantOnScholarship.filter(
      (participant) => participant.mahasiswa.username === username
    )[0];

    if (!participant) {
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

    const oldFilterData = participant.files.filter((item) => item.berkas != data.berkasId);

    const newData = {
      berkas: data.berkasId,
      name: data.name,
      url: data.url,
    };

    participant.files = [...oldFilterData, newData];

    await participant.save();
  }

  async countPaticipantByBeasiswaId(beasiswaId) {
    const participantsCount = await PesertaModel.countDocuments({ beasiswa: beasiswaId });

    return participantsCount;
  }
};

module.exports = PesertaService;
