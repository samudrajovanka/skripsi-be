const { VALIDATION_ERR } = require('../../constants/errorType');
const InvariantError = require('../../exceptions/InvariantError');

const {
  createBeasiswaSchema,
  updateBeasiswaSchema,
  addParticipantNewMahasiswaSchema,
  addParticipantExistMahasiswaSchema,
  uploadFileParticipantSchema,
  addDataValue,
  addPenilaiToMahasiswa,
  penilaiGiveScore,
  deletePenilaiSurvey,
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
  validateaddPenilaiToMahasiswa: (payload) => {
    const validationResult = addPenilaiToMahasiswa.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validatepenilaiGiveScore: (payload) => {
    const validationResult = penilaiGiveScore.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validatedeletePenilaiSurvey: (payload) => {
    const validationResult = deletePenilaiSurvey.validate(payload);

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
