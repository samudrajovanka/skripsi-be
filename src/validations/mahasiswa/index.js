const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createMahasiswaSchema,
  updateUserSchema
} = require('./schema');

const mahasiswaValidation = {
  validateCreatePayload: (payload) => {
    const validationResult = createMahasiswaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdatePayload: (payload) => {
    const validationResult = updateUserSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
};

module.exports = mahasiswaValidation;
