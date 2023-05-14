const mongoose = require('mongoose');

const SurveyModel = require("../../api/models/SurveyModel");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const MahasiswaService = require("./MahasiswaService");
const UserService = require("./UserService");
const { cfConvertionSurvey, cfPakarSurvey } = require("../../config/certaintyValueSurvey");

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
    const beasiswaRaw = await SurveyModel.aggregate([
      { $match: {
          user: new mongoose.Types.ObjectId(verifikatorId),
        }
      },
      {
        $group: {
          _id: "$beasiswa",
        },
      },
      {
        $lookup: {
          from: "beasiswas",
          localField: "_id",
          foreignField: "_id",
          as: "beasiswa",
        },
      },
      {
        $unwind: "$beasiswa",
      },
      {
        $sort: { "beasiswa.createdAt": -1 },
      },
      {
        $project: {
          _id: 0,
          beasiswa: 1,
        },
      },
    ]);

    const beasiswa = beasiswaRaw.map((item) => {
      const _beasiswa = item.beasiswa;

      _beasiswa.id = _beasiswa._id;
      delete _beasiswa._id;

      return _beasiswa;
    });

    return beasiswa;
  }

  async getMahasiswaIdByVerifikatorId(beasiswaId, verifikatorId) {
    const surveys = await SurveyModel.find({ beasiswa: beasiswaId, user: verifikatorId });

    const mahasiswaIdByVerifikator = surveys.map((item) => item.mahasiswa.toString());

    return mahasiswaIdByVerifikator;
  }

  async giveScore(mahasiswaId, verifikatorId, beasiswaId, { score } ) {
    await this.checkExistSurvey({ mahasiswaId, verifikatorId, beasiswaId });

    await SurveyModel.updateOne(
      { mahasiswa: mahasiswaId, user: verifikatorId, beasiswa: beasiswaId },
      { score }
    );
  }

  async getSurveysMahasiswa(username, beasiswaId) {
    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(username);

    const surveys = await SurveyModel.find({ mahasiswa: mahasiswa.id, beasiswa: beasiswaId })
      .populate({
        path: "user",
        select: "-password",
      })
      .select("-beasiswa -mahasiswa");

    if (!surveys.length) {
      throw new NotFoundError("Survey tidak ditemukan");
    }

    return surveys;
  }

  async getSurveys(user, { beasiswaId }) {
    let surveys = [];
    if (user.role === 'verifikator') {
      surveys = await SurveyModel.find({ beasiswa: beasiswaId, user: user.id })
        .populate({
          path: "mahasiswa",
          select: "-password",
        })
        .select("-beasiswa -user");
    } else {
      surveys = await SurveyModel.find({ beasiswa: beasiswaId })
        .populate({
          path: "mahasiswa",
          select: "-password",
        })
        .populate({
          path: "user",
          select: "-password",
        })
        .select("-beasiswa");
    }

    if (!surveys.length) {
      throw new NotFoundError("Survey tidak ditemukan");
    }

    return surveys;
  }

  async deleteVerifikatorSurvey(verifikatorId, mahasiswaId, beasiswaId) {
    await this.checkExistSurvey({ mahasiswaId, verifikatorId, beasiswaId });

    await SurveyModel.deleteOne({ mahasiswa: mahasiswaId, user: verifikatorId, beasiswa: beasiswaId });
  }

  async deleteManyByBeasiswaId(beasiswaId) {
    await SurveyModel.deleteMany({ beasiswa: beasiswaId });
  }

  async getAverageScorePerMahasiswa(beasiswaId) {
    const surveysRaw = await SurveyModel.aggregate([
      { $match: { beasiswa: new mongoose.Types.ObjectId(beasiswaId) } },
      {
        $group: {
          _id: "$mahasiswa",
          averageScore: { $avg: "$score" },
        },
      },
    ]);

    const surveys = surveysRaw.map((item) => {
      const itemJson = item;

      itemJson.mahasiswa = item._id;

      delete itemJson._id;

      return {
        ...itemJson,
        averageScore: itemJson.averageScore ?? 0
      };
    });

    return surveys;
  }

  async getCFAverageSurvey(beasiswaId) {
    const averages = await this.getAverageScorePerMahasiswa(beasiswaId);
    // console.log(averages);

    const result = averages.reduce((res, average) => {
      const cfSurvey = Object.entries(cfConvertionSurvey).find((item) => {
        const [, value] = item;

        return average.averageScore > value.min - 1 && average.averageScore <= value.max;
      });

      res[average.mahasiswa] = {
        averageScore: average.averageScore,
        cf: +cfSurvey[0] * cfPakarSurvey,
      }

      return res;
    }, {});

    // console.log(result);

    return result;
  }

  async deleteSurveyParticipant (beasiswaId, mahasiswaUsername) {
    const mahasiswaService = new MahasiswaService();
    const mahasiswa = await mahasiswaService.getByUsername(mahasiswaUsername);

    await SurveyModel.deleteMany({ beasiswa: beasiswaId, mahasiswa: mahasiswa.id });
  }
}

module.exports = SurveyService;
