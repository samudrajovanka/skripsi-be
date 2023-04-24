const Joi = require('joi');

exports.createFileSchema = Joi.object({
  name: Joi.string().required(),
});

exports.updateFileSchema = Joi.object({
  name: Joi.string().required(),
});
