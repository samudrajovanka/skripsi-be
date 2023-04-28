const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const PengumumanSchema = new BaseSchema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    files: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        }
      }
    ],
    isActive: {
      type: Boolean,
      required: true,
    }
  }
);

module.exports = mongoose.model('Pengumuman', PengumumanSchema);
