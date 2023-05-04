const FileService = require("../../services/database/FileService");
const { errorRes } = require("../../utils/errorResponse");
const fileValidation = require("../../validations/file");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    fileValidation.validateCreatePayload(req.body);
    
    const fileService = new FileService();
    const file = await fileService.create({ name });

    res.status(201).json({
      success: true,
      message: 'Berkas berhasil ditambahkan',
      data: {
        berkas: file
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getAll = async (req, res) => {
  try {
    const fileService = new FileService();
    const files = await fileService.getAll();

    res.status(200).json({
      success: true,
      data: {
        berkas: files
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const fileService = new FileService();
    const file = await fileService.getById(id);

    res.status(200).json({
      success: true,
      data: {
        berkas: file
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    fileValidation.validateUpdatePayload(req.body);

    const fileService = new FileService();
    await fileService.updateById(id, { name });

    res.status(200).json({
      success: true,
      message: 'Berkas berhasil diperbarui'
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const fileService = new FileService();
    await fileService.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Berkas berhasil dihapus'
    });
  } catch (error) {
    return errorRes(res, error);
  }
}
