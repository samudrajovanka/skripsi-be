const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createKriteriaSchema,
  updateKriteriaSchema,
  addParameterSchema,
  updateParameterSchema
} = require('./schema');

const kriteriaValidation = {
  validateCreatePayload: (payload) => {
    const validationResult = createKriteriaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdatePayload: (payload) => {
    const validationResult = updateKriteriaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateAddParameterPayload: (payload) => {
    const validationResult = addParameterSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdateParameterPayload: (payload) => {
    const validationResult = updateParameterSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  }
};

module.exports = kriteriaValidation;
