const BeasiswaService = require('../../services/database/BeasiswaService');
const PenilaiService = require('../../services/database/PenilaiService');
const PesertaService = require('../../services/database/PesertaService');
const SurveyService = require('../../services/database/SurveyService');
const { errorRes } = require('../../utils/errorResponse');
const beasiswaValidation = require('../../validations/beasiswa');

exports.getAll = async (req, res) => {
  try {
    const { role = "mahasiswa" } = req.user;

    const beasiswaService = new BeasiswaService();

    if (role === "mahasiswa") {
      const allBeasiswa = await beasiswaService.getByMahasiswa(req.user.id);
      
      return res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan semua periode beasiswa",
        data: {
          beasiswa: allBeasiswa
        }
      })
    }

    if (role === "verifikator") {
      const allBeasiswa = await beasiswaService.getByVerifikator(req.user.username, req.user.id);
      return res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan semua periode beasiswa",
        data: {
          beasiswa: allBeasiswa
        }
      })
    }

    const allBeasiswa = await beasiswaService.getAll();

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua periode beasiswa",
      data: {
        beasiswa: allBeasiswa
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    const beasiswa = await beasiswaService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan periode beasiswa",
      data: {
        beasiswa
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.create = async (req, res) => {
  try {
    beasiswaValidation.validateCreatePayload(req.body);

    const beasiswaService = new BeasiswaService();

    const beasiswa = await beasiswaService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Berhasil membuat periode beasiswa baru",
      data: {
        beasiswa
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.update = async (req, res) => {
  try {
    beasiswaValidation.validateUpdatePayload(req.body);

    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    const beasiswa = await beasiswaService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil memperbarui periode beasiswa",
      data: {
        beasiswa
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    await beasiswaService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus periode beasiswa",
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.addParticipantExistMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;

    beasiswaValidation.validateAddParticipantExistMahasiswa(req.body);

    const beasiswaService = new BeasiswaService();

    await beasiswaService.addParticipantExistMahasiswa(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil menambahkan mahasiswa ke periode beasiswa"
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.addParticipantNewMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;

    beasiswaValidation.validateAddParticipantNewMahasiswa(req.body);

    const beasiswaService = new BeasiswaService();

    await beasiswaService.addParticipantNewMahasiswa(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil menambahkan mahasiswa ke periode beasiswa"
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getParticipantBeasiswa = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    let participants = [];

    if (req.user.role === "verifikator") {
      participants = await beasiswaService.getParticipantsByBeasiswaIdVerifiktor(id, req.user.id);
    } else {
      participants = await beasiswaService.getParticipantsByBeasiswaId(id);
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua peserta beasiswa",
      data: {
        peserta: participants
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.deleteParticipantBeasiswa = async (req, res) => {
  try {
    const { id, username } = req.params;

    const beasiswaService = new BeasiswaService();

    await beasiswaService.deleteParticipant(id, username);

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus peserta beasiswa"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const mahasiswaId = req.user.id;

    beasiswaValidation.validateUploadFileParticipant(req.body);

    const beasiswaService = new BeasiswaService();

    const { berkasId } = req.body;
    
    await beasiswaService.uploadFile(id, mahasiswaId, req.file, berkasId);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengupload file"
    })
  } catch (error) {
    return errorRes(res, error);
  }
};

exports.getParticipantByUsername = async (req, res) => {
  try {
    const { id, username } = req.params;

    const pesertaService = new PesertaService();

    const participant = await pesertaService.getParticipantByUsername(id, username);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan peserta beasiswa",
      data: {
        peserta: participant
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getParticipantMe = async (req, res) => {
  try {
    const { id } = req.params;

    const pesertaService = new PesertaService();

    const participant = await pesertaService.getParticipantByUsername(id, req.user.username);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan peserta beasiswa",
      data: {
        peserta: participant
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.addDataValue = async (req, res) => {
  try {
    beasiswaValidation.validateAddDataValueParticipant(req.body);

    const { id, username } = req.params;

    const penilaiService = new PenilaiService();

    await penilaiService.add(id, username, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil memasukkan nilai peserta beasiswa"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.addVerifikatorToMahasiswa = async (req, res) => {
  try {
    beasiswaValidation.validateAddVerifikatorToMahasiswa(req.body);

    const { id: beasiswaId, username } = req.params;

    const { usernameVerifikator } = req.body;

    const beasiswaService = new BeasiswaService();
    await beasiswaService.addVerifikatorToMahasiswa({
      username,
      usernameVerifikator,
      beasiswaId
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil menambahkan verifikator ke mahasiswa"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.verifikatorGiveScore = async (req, res) => {
  try {
    beasiswaValidation.validateVerifikatorGiveScore(req.body);

    const { id: beasiswaId, username } = req.params;

    const { score } = req.body;

    const beasiswaService = new BeasiswaService();
    await beasiswaService.verifikatorGiveScore(
      username,
      req.user.id,
      beasiswaId,
      { score }
    );

    return res.status(200).json({
      success: true,
      message: "Berhasil memberikan nilai survey mahasiswa"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getSurveys = async (req, res) => {
  try {
    const { id: beasiswaId } = req.params;

    const surveyService = new SurveyService();
    const surveys = await surveyService.getSurveys(req.user, { beasiswaId });

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data survey",
      data: {
        surveys
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getSurveysMahasiswa = async (req, res) => {
  try {
    const { id: beasiswaId, username } = req.params;

    const surveyService = new SurveyService();
    const surveys = await surveyService.getSurveysMahasiswa(username, beasiswaId);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan survey mahasiswa",
      data: {
        surveys
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.deleteVerifikatorSurvey = async (req, res) => {
  try {
    beasiswaValidation.validateDeleteVerifikatorSurvey(req.body);

    const { id: beasiswaId, username } = req.params;

    const { verifikatorId } = req.body;

    const beasiswaService = new BeasiswaService();
    await beasiswaService.deleteVerifikatorSurvey(verifikatorId, username, beasiswaId);

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus verifikator survey"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.updateLockBeasiswa = async (req, res) => {
  try {
    beasiswaValidation.validateUpdateLockBeasiswa(req.body);

    const { id } = req.params;

    const beasiswaService = new BeasiswaService();
    await beasiswaService.updateLockBeasiswa(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengupdate status lock beasiswa"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.seleksiBeasiswa = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    const seleksiResult = await beasiswaService.seleksi(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil melakukan seleksi beasiswa",
      data: {
        result: seleksiResult
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.seleksiBeasiswaAndSave = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    await beasiswaService.seleksiAndSave(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil menyimpan seleksi beasiswa"
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getBeasiswaResult = async (req, res) => {
  try {
    const { id } = req.params;

    const beasiswaService = new BeasiswaService();

    const result = await beasiswaService.getBeasiswaResult(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan hasil seleksi beasiswa",
      data: {
        result
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}
