const Joi = require('joi');

exports.createKriteriaSchema = Joi.object({
  name: Joi.string().required(),
});

exports.updateKriteriaSchema = Joi.object({
  name: Joi.string().required(),
});

exports.addParameterSchema = Joi.object({
  name: Joi.string().required(),
  certaintyValue: Joi.number().min(-1).max(1).required(),
});

exports.updateParameterSchema = Joi.object({
  name: Joi.string().required(),
  certaintyValue: Joi.number().min(-1).max(1).required(),
});
