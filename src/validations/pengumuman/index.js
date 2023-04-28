const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createPengumumanSchema,
  updatePengumumanSchema
} = require('./schema');

const pengumumanValidation = {
  validateCreatePayload: (payload) => {
    const validationResult = createPengumumanSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdatePayload: (payload) => {
    const validationResult = updatePengumumanSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  }
};

module.exports = pengumumanValidation;
