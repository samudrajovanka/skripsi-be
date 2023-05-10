const KriteriaService = require("../../services/database/KriteriaService");
const { errorRes } = require('../../utils/errorResponse');
const kriteriaValidation = require("../../validations/kriteria");

exports.create = async (req, res) => {
  try {
    kriteriaValidation.validateCreatePayload(req.body);

    const kriteriaService = new KriteriaService();

    const kriteria = await kriteriaService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Kriteria berhasil dibuat",
      data: {
        kriteria
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
};

exports.getAll = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteria = await kriteriaService.getAll();

    res.status(200).json({
      success: true,
      message: "Kriteria berhasil didapatkan",
      data: {
        kriteria
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.getById = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;

    const kriteria = await kriteriaService.getById(kriteriaId);

    res.status(200).json({
      success: true,
      message: "Kriteria berhasil didapatkan",
      data: {
        kriteria
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.updateById = async (req, res) => {
  try {
    kriteriaValidation.validateUpdatePayload(req.body);

    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;

    const kriteria = await kriteriaService.updateById(kriteriaId, req.body);

    res.status(200).json({
      success: true,
      message: "Kriteria berhasil diupdate"
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.deleteById = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;

    await kriteriaService.deleteById(kriteriaId);

    res.status(200).json({
      success: true,
      message: "Kriteria berhasil dihapus",
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.getAllParameter = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;

    const parameters = await kriteriaService.getAllParameter(kriteriaId);

    res.status(200).json({
      success: true,
      message: "Parameter berhasil didapatkan",
      data: {
        parameters
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.getParameterById = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;
    const parameterId = req.params.parameterId;

    const parameter = await kriteriaService.getParameterById(kriteriaId, parameterId);

    res.status(200).json({
      success: true,
      message: "Parameter berhasil didapatkan",
      data: {
        parameter
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.addParameter = async (req, res) => {
  try {
    kriteriaValidation.validateAddParameterPayload(req.body);

    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;

    const parameter = await kriteriaService.addParameter(kriteriaId, req.body);

    res.status(201).json({
      success: true,
      message: "Parameter berhasil dibuat",
      data: {
        parameter
      }
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.updateParameterById = async (req, res) => {
  try {
    kriteriaValidation.validateUpdateParameterPayload(req.body);

    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;
    const parameterId = req.params.parameterId;

    const parameter = await kriteriaService.updateParameter(kriteriaId, parameterId, req.body);

    res.status(200).json({
      success: true,
      message: "Parameter berhasil diupdate"
    });
  } catch (error) {
    return errorRes(res, error)
  }
}

exports.deleteParameterById = async (req, res) => {
  try {
    const kriteriaService = new KriteriaService();

    const kriteriaId = req.params.id;
    const parameterId = req.params.parameterId;

    await kriteriaService.deleteParameter(kriteriaId, parameterId);

    res.status(200).json({
      success: true,
      message: "Parameter berhasil dihapus",
    });
  } catch (error) {
    return errorRes(res, error)
  }
}
