const mahasiswaValidation = require('../../validations/mahasiswa');
const { errorRes } = require('../../utils/errorResponse');
const MahasiswaService = require('../../services/database/MahasiswaService');

exports.createMahasiswa = async (req, res) => {
  try {
    mahasiswaValidation.validateCreatePayload(req.body);

    const mahasiswaService = new MahasiswaService();

    await mahasiswaService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Berhasil membuat user baru',
    })
  } catch (error) {
    return errorRes(res, error);
  }
};

exports.getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswaService = new MahasiswaService();

    const users = await mahasiswaService.getAll();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan semua user',
      data: {
        mahasiswa: users
      },
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getByUsername = async (req, res) => {
  try {
    const mahasiswaService = new MahasiswaService();

    const user = await mahasiswaService.getByUsername(req.params.username);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan user',
      data: {
        mahasiswa: user
      },
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.updateByUsername = async (req, res) => {
  try {
    mahasiswaValidation.validateUpdatePayload(req.body);

    const mahasiswaService = new MahasiswaService();

    await mahasiswaService.updateByUsername(req.params.username, req.body);

    return res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui user',
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.deleteByUsername = async (req, res) => {
  try {
    const mahasiswaService = new MahasiswaService();

    await mahasiswaService.deleteByUsername(req.params.username);

    return res.status(200).json({
      success: true,
      message: 'Berhasil menghapus user',
    })
  } catch (error) {
    return errorRes(res, error);
  }
}
