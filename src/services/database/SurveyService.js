const SurveyModel = require("../../api/models/SurveyModel");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const MahasiswaService = require("./MahasiswaService");
const UserService = require("./UserService");

class SurveyService {
  async checkUserIsVerifikator(username) {
    const userService = new UserService();
    const user = await userService.getByUsername(username);

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    if (user.role !== "verifikator") {
      throw new InvariantError("User bukan verifikator");
    }

    return user;
  }

  async checkExistSurvey({ mahasiswaId, verifikatorId, beasiswaId }) {
    const isExist = await SurveyModel.exists({
      mahasiswa: mahasiswaId,
      user: verifikatorId,
      beasiswa: beasiswaId,
    });

    if (!isExist) {
      throw new NotFoundError("Survey tidak ditemukan");
    }
  }

  async checkDuplicateSurvey({ mahasiswaId, verifikatorId, beasiswaId }) {
    const survey = await SurveyModel.findOne({
      mahasiswa: mahasiswaId,
      user: verifikatorId,
      beasiswa: beasiswaId,
    });

    if (survey) {
      throw new InvariantError("Verifikator telah dimasukkan sebelumnya");
    }
  }

  async add({ mahasiswaId, usernameVerifikator, beasiswaId }) {
    const user = await this.checkUserIsVerifikator(usernameVerifikator);
    
    await this.checkDuplicateSurvey({ mahasiswaId, verifikatorId: user.id, beasiswaId });

    await SurveyModel.create({
      user: user.id,
      beasiswa: beasiswaId,
      mahasiswa: mahasiswaId,
    });
  }

  async getBeasiswaByVerifikatorId(verifikatorId) {
    const beasiswaRaw = await SurveyModel.find({ user: verifikatorId })
      .populate("beasiswa")
      .select("beasiswa");

    const beasiswa = beasiswaRaw.map((item) => item.beasiswa)
      .sort((a, b) => b.createdAt - a.createdAt);

    return beasiswa;
  }

  async giveScore(mahasiswaId, verifikatorId, beasiswaId, { score } ) {
    await this.checkExistSurvey({ mahasiswaId, verifikatorId, beasiswaId });

    if (isLockedBeasiswa) {
      throw new InvariantError("Beasiswa telah dikunci, tidak dapat memberikan nilai");
    }

    await SurveyModel.updateOne(
      { mahasiswa: mahasiswaId, user: verifikatorId, beasiswa: beasiswaId },
      { score }
    );
  }

  async getSurveys(username, beasiswaId) {
    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(username);

    const surveysRaw = await SurveyModel.find({ mahasiswa: mahasiswa.id, beasiswa: beasiswaId })
    .populate("user")
    .select("-beasiswa -mahasiswa");

    if (!surveysRaw.length) {
      throw new NotFoundError("Survey tidak ditemukan");
    }

    // remove password
    const surveys = surveysRaw.map((item) => {
      const itemJson = item.toJSON();

      delete itemJson.user.password;

      return itemJson;
    });

    return surveys;
  }

  async deleteVerifikatorSurvey(verifikatorId, mahasiswaId, beasiswaId) {
    await this.checkExistSurvey({ mahasiswaId, verifikatorId, beasiswaId });

    await SurveyModel.deleteOne({ mahasiswa: mahasiswaId, user: verifikatorId, beasiswa: beasiswaId });
  }
}

module.exports = SurveyService;
