const router = require('express').Router();

const multer = require('multer');
const beasiswaController = require('../controllers/beasiswaController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const { upload } = require('../middleware/uploadFile');

router.get('/', authentication, beasiswaController.getAll);
router.post('/', authentication, authorization(['admin']), beasiswaController.create);
router.get('/:id', authentication, beasiswaController.getById);
router.put('/:id', authentication, authorization(['admin']), beasiswaController.update);
router.delete('/:id', authentication, authorization(['admin']), beasiswaController.delete);
router.post(
  '/:id/peserta',
  authentication,
  authorization(['admin']),
  beasiswaController.addParticipantExistMahasiswa
);
router.post(
  '/:id/peserta-baru',
  authentication,
  authorization(['admin']),
  beasiswaController.addParticipantNewMahasiswa
);
router.get(
  '/:id/peserta',
  authentication,
  authorization(['admin']),
  beasiswaController.getParticipantBeasiswa
);
router.delete(
  '/:id/peserta/:username',
  authentication,
  authorization(['admin']),
  beasiswaController.deleteParticipantBeasiswa
);
router.post(
  '/:id/peserta/upload-berkas',
  authentication,
  authorization(['mahasiswa']),
  upload('pdf')('single', 'file'),
  beasiswaController.uploadFile
);
router.get(
  '/:id/peserta/:username',
  authentication,
  authorization(['admin', 'verifikator', 'penilai']),
  beasiswaController.getParticipantByUsername
);
router.post(
  '/:id/peserta/:username/nilai',
  authentication,
  authorization(['penilai']),
  beasiswaController.addDataValue
);
router.post(
  '/:id/peserta/:username/verifikator',
  authentication,
  authorization(['admin']),
  beasiswaController.addVerifikatorToMahasiswa
)
router.delete(
  '/:id/peserta/:username/verifikator',
  authentication,
  authorization(['admin']),
  beasiswaController.deleteVerifikatorSurvey
)
router.post(
  '/:id/peserta/:username/survey',
  authentication,
  authorization(['verifikator']),
  beasiswaController.verifikatorGiveScore
);
router.get(
  '/:id/peserta/:username/survey',
  authentication,
  authorization(['admin', 'penilai', 'verifikator']),
  beasiswaController.getSurveysMahasiswa
);

module.exports = router;
