const ParameterModel = require("../../api/models/ParameterModel");

class ParameterService {
  async getAllParameterByKriteria(kriteriaId) {
    const parameters = await ParameterModel.find({ kriteria: kriteriaId })
      .sort({ certaintyValue: 1 });

    return parameters;
  }

  async create(kriteriaId, { name, certaintyValue }) {
    const parameter = ParameterModel({ name, certaintyValue, kriteria: kriteriaId });

    await parameter.save();

    return parameter;
  }

  async updateById(id, { name, certaintyValue }) {
    await this.checkExistById(id);

    const parameter = await ParameterModel.findByIdAndUpdate(
      id,
      {
        name,
        certaintyValue,
      }
    );

    return parameter;
  }

  async deleteById(id) {
    await this.checkExistById(id);

    await ParameterModel.findByIdAndDelete(id);
  }

  async checkExistById(id) {
    const parameter = await ParameterModel.exists({ _id: id });

    if (!parameter) {
      throw new NotFoundError(`Parameter dengan id ${id} tidak ditemukan`);
    }
  }

}

module.exports = ParameterService;
