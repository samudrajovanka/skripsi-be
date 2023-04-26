const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createBeasiswaSchema,
  updateBeasiswaSchema,
  addParticipantNewMahasiswaSchema,
  addParticipantExistMahasiswaSchema,
  uploadFileParticipantSchema,
  addDataValue,
  addVerifikatorToMahasiswa,
  verifikatorGiveScore,
  deleteVerifikatorSurvey,
  updateLockBeasiswa
} = require('./schema');

const beasiswaValidation = {
  validateCreatePayload: (payload) => {
    const validationResult = createBeasiswaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdatePayload: (payload) => {
    const validationResult = updateBeasiswaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateAddParticipantExistMahasiswa: (payload) => {
    const validationResult = addParticipantExistMahasiswaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateAddParticipantNewMahasiswa: (payload) => {
    const validationResult = addParticipantNewMahasiswaSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUploadFileParticipant: (payload) => {
    const validationResult = uploadFileParticipantSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateAddDataValueParticipant: (payload) => {
    const validationResult = addDataValue.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateAddVerifikatorToMahasiswa: (payload) => {
    const validationResult = addVerifikatorToMahasiswa.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateVerifikatorGiveScore: (payload) => {
    const validationResult = verifikatorGiveScore.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateDeleteVerifikatorSurvey: (payload) => {
    const validationResult = deleteVerifikatorSurvey.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUpdateLockBeasiswa: (payload) => {
    const validationResult = updateLockBeasiswa.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  }
};

module.exports = beasiswaValidation;
