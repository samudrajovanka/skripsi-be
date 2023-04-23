const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const KriteriaSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  }
);

module.exports = mongoose.model('Kriteria', KriteriaSchema);
