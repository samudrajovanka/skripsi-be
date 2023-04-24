const Joi = require('joi');

const config = require('../../config');

exports.createBeasiswaSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  quota: Joi.number().min(0).required(),
  openDate: Joi.date().required(),
  closeDate: Joi.date().required(),
  status: Joi.string().valid(...config.BEASISWA_STATUS).required(),
});

exports.updateBeasiswaSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  quota: Joi.number().min(0).required(),
  openDate: Joi.date().required(),
  closeDate: Joi.date().required(),
  status: Joi.string().valid(...config.BEASISWA_STATUS).required(),
});

exports.addParticipantExistMahasiswaSchema = Joi.object({
  mahasiswaId: Joi.string().required(),
  mahasiswaNim: Joi.string().required(),
});

exports.addParticipantNewMahasiswaSchema = Joi.object({
  name: Joi.string().required(),
  nim: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
});

exports.uploadFileParticipantSchema = Joi.object({
  berkasId: Joi.string().required()
});
