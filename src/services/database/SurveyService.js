const mongoose = require('mongoose');

const SurveyModel = require("../../api/models/SurveyModel");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const MahasiswaService = require("./MahasiswaService");
const UserService = require("./UserService");
const { cfConvertionSurvey, cfPakarSurvey } = require("../../config/certaintyValueSurvey");

class SurveyService {
  async checkUserIsPenilai(username) {
    const userService = new UserService();
    const user = await userService.getByUsername(username);

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    if (user.role !== "penilai") {
      throw new InvariantError("User bukan penilai");
    }

    return user;
  }

  async checkExistSurvey({ mahasiswaId, penilaiId, beasiswaId }) {
    const isExist = await SurveyModel.exists({
      mahasiswa: mahasiswaId,
      user: penilaiId,
      beasiswa: beasiswaId,
    });

    if (!isExist) {
      throw new NotFoundError("Survey tidak ditemukan");
    }
  }

  async checkDuplicateSurvey({ mahasiswaId, penilaiId, beasiswaId }) {
    const survey = await SurveyModel.findOne({
      mahasiswa: mahasiswaId,
      user: penilaiId,
      beasiswa: beasiswaId,
    });

    if (survey) {
      throw new InvariantError("Penilai telah dimasukkan sebelumnya");
    }
  }

  async add({ mahasiswaId, usernamePenilai, beasiswaId }) {
    const user = await this.checkUserIsPenilai(usernamePenilai);
    
    await this.checkDuplicateSurvey({ mahasiswaId, penilaiId: user.id, beasiswaId });

    await SurveyModel.create({
      user: user.id,
      beasiswa: beasiswaId,
      mahasiswa: mahasiswaId,
    });
  }

  async getBeasiswaByPenilaiId(penilaiId) {
    const beasiswaRaw = await SurveyModel.aggregate([
      { $match: {
          user: new mongoose.Types.ObjectId(penilaiId),
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

  async getMahasiswaIdByPenilaiId(beasiswaId, penilaiId) {
    const surveys = await SurveyModel.find({ beasiswa: beasiswaId, user: penilaiId });

    const mahasiswaIdByPenilai = surveys.map((item) => item.mahasiswa.toString());

    return mahasiswaIdByPenilai;
  }

  async giveScore(mahasiswaId, penilaiId, beasiswaId, { score } ) {
    await this.checkExistSurvey({ mahasiswaId, penilaiId, beasiswaId });

    await SurveyModel.updateOne(
      { mahasiswa: mahasiswaId, user: penilaiId, beasiswa: beasiswaId },
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
    if (user.role === 'penilai') {
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

    surveys = surveys.sort((a, b) => +a.mahasiswa.nim - +b.mahasiswa.nim)

    return surveys;
  }

  async deletePenilaiSurvey(penilaiId, mahasiswaId, beasiswaId) {
    await this.checkExistSurvey({ mahasiswaId, penilaiId, beasiswaId });

    await SurveyModel.deleteOne({ mahasiswa: mahasiswaId, user: penilaiId, beasiswa: beasiswaId });
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
