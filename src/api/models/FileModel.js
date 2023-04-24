const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const FileSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  }
);

module.exports = mongoose.model('File', FileSchema);
