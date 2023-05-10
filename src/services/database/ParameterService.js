const ParameterModel = require("../../api/models/ParameterModel");
const NotFoundError = require("../../exceptions/NotFoundError");

class ParameterService {
  async getAllParameterByKriteria(kriteriaId) {
    const parameters = await ParameterModel.find({ kriteria: kriteriaId })
      .sort({ certaintyValue: 1 })
      .select("-kriteria");

    return parameters;
  }

  async getById(kriteriaId, parameterId) {
    await this.checkExistById(kriteriaId, parameterId);

    const parameter = await ParameterModel.findOne({ kriteria: kriteriaId, _id: parameterId });

    return parameter;
  }

  async create(kriteriaId, { name, certaintyValue }) {
    const parameter = ParameterModel({ name, certaintyValue, kriteria: kriteriaId });

    await parameter.save();

    return parameter;
  }

  async updateById(kriteriaId, parameterId, { name, certaintyValue }) {
    await this.checkExistById(kriteriaId, parameterId);

    const parameter = await ParameterModel.findOneAndUpdate(
      {
        kriteria: kriteriaId,
        _id: parameterId,
      },
      {
        name,
        certaintyValue,
      }
    );

    return parameter;
  }

  async deleteById(kriteriaId, parameterId) {
    await this.checkExistById(kriteriaId, parameterId);

    await ParameterModel.findOneAndDelete({
      kriteria: kriteriaId,
      _id: parameterId,
    });
  }

  async checkExistById(kriteriaId, parameterId) {
    const parameter = await ParameterModel.exists({
      kriteria: kriteriaId,
      _id: parameterId
    });

    if (!parameter) {
      throw new NotFoundError(`Parameter dengan id ${parameterId} pada kriteria id ${kriteriaId} tidak ditemukan`);
    }
  }

}

module.exports = ParameterService;
