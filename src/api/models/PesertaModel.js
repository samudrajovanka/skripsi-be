const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');

const PesertaSchema = new BaseSchema(
  {
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
    data: [
      {
        kriteria: {
          type: BaseSchema.Types.ObjectId,
          ref: 'Kriteria',
          required: true,
        },
        parameter: {
          type: BaseSchema.Types.ObjectId,
          ref: 'Parameter',
          required: true,
        }
      }
    ],
    files: [
      {
        berkas: {
          type: BaseSchema.Types.ObjectId,
          ref: 'Berkas',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        }
      }
    ]
  }
);

module.exports = mongoose.model('Peserta', PesertaSchema);
