const KriteriaModel = require('../../api/models/KriteriaModel');
const ParameterModel = require('../../api/models/ParameterModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const ParameterService = require('./ParameterService');

class KriteriaService {
  async create({ name }) {
    const kriteria = KriteriaModel({ name });

    await kriteria.save();

    return kriteria;
  }

  async getAll() {
    const kriteria = await KriteriaModel.find();

    return kriteria;
  }

  async getById(id) {
    await this.checkExistById(id);
    
    const kriteria = await KriteriaModel.findById(id);

    return kriteria;
  }

  async updateById(id, { name }) {
    await this.checkExistById(id);

    const kriteria = await KriteriaModel.findByIdAndUpdate(
      id,
      {
        name
      }
    );

    return kriteria;
  }

  async deleteById(id) {
    await this.checkExistById(id);

    await KriteriaModel.findByIdAndDelete(id);
  }

  async checkExistById(id) {
    const kriteria = await KriteriaModel.exists({ _id: id });

    if(!kriteria) {
      throw new NotFoundError(`Kriteria dengan id ${id} tidak ditemukan`);
    }
  }

  async getAllParameter(kriteriaId) {
    await this.checkExistById(kriteriaId);

    const parameterService = new ParameterService();

    const parameter = await parameterService.getAllParameterByKriteria(kriteriaId);

    return parameter;
  }

  async getParameterById(kriteriaId, parameterId) {
    await this.checkExistById(kriteriaId);

    const parameterService = new ParameterService();

    const parameter = await parameterService.getById(kriteriaId, parameterId);

    return parameter;
  }

  async addParameter(kriteriaId, { name, certaintyValue }) {
    await this.checkExistById(kriteriaId);

    const parameterService = new ParameterService();

    const parameter = await parameterService.create(kriteriaId, { name, certaintyValue });

    return parameter;
  }

  async updateParameter(kriteriaId, parameterId, { name, certaintyValue }) {
    await this.checkExistById(kriteriaId);

    const parameterService = new ParameterService();

    const parameter = await parameterService.updateById(kriteriaId, parameterId, { name, certaintyValue });

    return parameter;
  }

  async deleteParameter(kriteriaId, parameterId) {
    await this.checkExistById(kriteriaId);

    const parameterService = new ParameterService();

    await parameterService.deleteById(kriteriaId, parameterId);
  }
}

module.exports = KriteriaService;
