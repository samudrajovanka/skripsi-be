const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const MahasiswaSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nim: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    }
  }
);

module.exports = mongoose.model('Mahasiswa', MahasiswaSchema);
