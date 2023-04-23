const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');
const config = require('../../config');

const BeasiswaSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    quota: {
      type: Number,
      required: true,
    },
    openDate: {
      type: Date,
      required: true,
    },
    closeDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: config.BEASISWA_STATUS,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    result: [{
      mahasiswa: {
        type: BaseSchema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['diterima', 'ditolak'],
        required: true,
      }
    }]
  }
);

module.exports = mongoose.model('Beasiswa', BeasiswaSchema);
