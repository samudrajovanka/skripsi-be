const AuthService = require("../../services/database/authService");
const { errorRes } = require("../../utils/errorResponse");
const authValidation = require("../../validations/auth");

exports.login = async (req, res) => {
  try {
    const { login_as: loginAs = 'user' } = req.query;

    authValidation.validateLoginPayload(req.body);

    const authService = new AuthService();

    const accessToken = await authService.login(loginAs, req.body);

    return res.status(200).json({
      success: true,
      message: "Berhasil login",
      data: {
        accessToken,
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: {
        user: req.user,
      }
    });
  } catch (error) {
    return errorRes(res, error);
  }
}