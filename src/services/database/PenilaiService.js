const PesertaModel = require('../../api/models/PesertaModel');
const InvariantError = require('../../exceptions/InvariantError');
const BeasiswaService = require('./BeasiswaService');

class PenilaiService {
  async add(beasiswaId, username, { data }) {
    const beasiswaService = new BeasiswaService();
    const beasiswa = await beasiswaService.getById(beasiswaId);
    if (isLocked) {
      throw new InvariantError('Beasiswa sudah dikunci, tidak bisa memberikan nilai');
    }

    const participantOnScholarship = await PesertaModel.find({
      beasiswa: beasiswaId,
    }).populate("mahasiswa")

    const participant = participantOnScholarship.filter(
      (participant) => participant.mahasiswa.username === username
    )[0];

    if (!participant) {
      throw new NotFoundError('Peserta tidak ditemukan');
    }

    // check duplicate kriteriaId
    const lookup = data.reduce((result, item) => {
      result[item.kriteriaId] = ++result[item.kriteriaId] || 0;
      return result;
    }, {});

    const isDuplicateKriteria = data.some((item) =>
      lookup[item.kriteriaId] > 0
    );

    if (isDuplicateKriteria) {
      throw new InvariantError("Tidak boleh ada duplikasi kriteria penilaian");
    }

    const parameterIds = data.map((item) => item.parameterId);

    await PesertaModel.findOneAndUpdate(
      { beasiswa: beasiswaId, mahasiswa: participant.mahasiswa.id },
      { data: parameterIds }
    );
  }
}

module.exports = PenilaiService;
