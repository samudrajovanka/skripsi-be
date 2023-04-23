const Joi = require('joi');

const config = require('../../config');

exports.createUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().min(4).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  role: Joi.string().valid(...config.USER_ROLE).required(),
});

exports.updateUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().min(4).required(),
  role: Joi.string().valid(...config.USER_ROLE).required(),
});
