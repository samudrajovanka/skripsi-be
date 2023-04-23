const Joi = require('joi');

exports.login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
