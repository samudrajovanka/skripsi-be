const BeasiswaService = require('../../services/database/BeasiswaService');
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

    if (role === "surveyor") {
      return
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

    const participants = await beasiswaService.getParticipantsByBeasiswaId(id);

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
