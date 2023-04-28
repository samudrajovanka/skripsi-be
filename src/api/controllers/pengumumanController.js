const PengumumanService = require("../../services/database/PengumumanService");
const { errorRes } = require("../../utils/errorResponse");
const pengumumanValidation = require("../../validations/pengumuman");

exports.create = async (req, res) => {
  try {
    pengumumanValidation.validateCreatePayload(req.body);

    const pengumumanService = new PengumumanService();
    console.log(req.files);
    console.log(req.files.length);
    
    const pengumuman = await pengumumanService.create({ ...req.body, files: req.files });

    return res.status(201).json({
      success: true,
      message: "Berhasil membuat pengumuman",
      data: {
        pengumuman
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getAll = async (req, res) => {
  try {
    const pengumumanService = new PengumumanService();

    const pengumuman = await pengumumanService.getAll();

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua pengumuman",
      data: {
        pengumuman
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const pengumumanService = new PengumumanService();

    const pengumuman = await pengumumanService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan pengumuman",
      data: {
        pengumuman
      }
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const pengumumanService = new PengumumanService();

    await pengumumanService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus pengumuman",
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;

    pengumumanValidation.validateUpdatePayload(req.body);

    const pengumumanService = new PengumumanService();

    await pengumumanService.updateById(id, { ...req.body, files: req.files });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengubah pengumuman"
    })
  } catch (error) {
    return errorRes(res, error);
  }
}
