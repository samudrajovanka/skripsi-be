const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const SurveySchema = new BaseSchema(
  {
    user: {
      type: BaseSchema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    beasiswa: {
      type: BaseSchema.Types.ObjectId,
      ref: 'Beasiswa',
      required: true,
    },
    mahasiswa: {
      type: BaseSchema.Types.ObjectId,
      ref: 'Mahasiswa',
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 68
    },
  }
);

module.exports = mongoose.model('Survey', SurveySchema);
