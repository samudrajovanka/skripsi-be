const multer = require('multer');
const InvariantError = require('../../exceptions/InvariantError');
const { errorRes } = require('../../utils/errorResponse');

/**
 * @description: accept file format
 */
const fileFilter = (acceptedFormat) => (req, file, callback) => {
  if (acceptedFormat.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new InvariantError('Format file tidak didukung'));
  }
}

const uploadPDF = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter(['application/pdf']),
});


exports.upload = (type) =>
  (engine, option) =>
  (req, res, next) => {
  let uploadEngine;
  switch (type) {
    case 'pdf':
      uploadEngine = uploadPDF;
  }

  uploadEngine[engine](...option)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return errorRes(res, new InvariantError('File yang diupload melebihi batas maksimal'));
        }
      }

      return errorRes(res, err)
    }

    next();
  });
}
