const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createFileSchema,
  updateFileSchema
} = require('./schema');

const fileValidation = {
  validateCreatePayload: (payload) => {
    const validationResult = createFileSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdatePayload: (payload) => {
    const validationResult = updateFileSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  }
};

module.exports = fileValidation;
