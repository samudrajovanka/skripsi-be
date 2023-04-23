const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const ParameterSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    certaintyValue: {
      type: Number,
      required: true,
    },
    kriteria: {
      type: BaseSchema.Types.ObjectId,
      ref: 'Kriteria',
    }
  }
);

module.exports = mongoose.model('Parameter', ParameterSchema);
