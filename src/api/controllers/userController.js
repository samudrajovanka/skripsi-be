const userValidation = require('../../validations/user');
const { errorRes } = require('../../utils/errorResponse');
const UserService = require('../../services/database/UserService');

exports.createUser = async (req, res) => {
  try {
    userValidation.validateCreatePayload(req.body);

    const userService = new UserService();

    await userService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Berhasil membuat user baru',
    })
  } catch (error) {
    return errorRes(res, error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const userService = new UserService();

    const users = await userService.getAll();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan semua user',
      data: {
        users
      },
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getByUsername = async (req, res) => {
  try {
    const userService = new UserService();

    const user = await userService.getByUsername(req.params.username);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan user',
      data: {
        user
      },
    })
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.updateByUsername = async (req, res) => {
  try {
    userValidation.validateUpdatePayload(req.body);

    const userService = new UserService();

    await userService.updateByUsername(req.params.username, req.body);

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
    const userService = new UserService();

    await userService.deleteByUsername(req.params.username);

    return res.status(200).json({
      success: true,
      message: 'Berhasil menghapus user',
    })
  } catch (error) {
    return errorRes(res, error);
  }
}
