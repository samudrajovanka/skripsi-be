const Joi = require('joi');

exports.createPengumumanSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  isActive: Joi.boolean().required(),
});

exports.updatePengumumanSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  isActive: Joi.boolean().required(),
  oldFiles: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required(),
  })),
});
