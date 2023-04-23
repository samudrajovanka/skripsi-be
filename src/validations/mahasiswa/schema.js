const Joi = require('joi');

exports.createMahasiswaSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  nim: Joi.string().required(),
  beasiswaId: Joi.string().required()
});

exports.updateUserSchema = Joi.object({
  name: Joi.string().required(),
});
