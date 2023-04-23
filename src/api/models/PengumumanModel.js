const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const PengumumanSchema = new BaseSchema(
  {
    title: {
      type: string,
      required: true,
      trim: true,
    },
    content: {
      type: string,
      required: true,
      trim: true,
    },
    file: {
      name: {
        type: string,
        required: true,
      },
      url: {
        type: string,
        required: true,
      }
    },
    isActive: {
      type: Boolean,
      required: true,
    }
  }
);

module.exports = mongoose.model('Pengumuman', PengumumanSchema);
