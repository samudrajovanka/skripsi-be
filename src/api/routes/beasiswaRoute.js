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
router.put('/:id/lock', authentication, authorization(['admin']), beasiswaController.updateLockBeasiswa);
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
  authorization(['admin', 'penilai', 'verifikator']),
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
  upload('pdf')('single', ['file']),
  beasiswaController.uploadFile
);
router.get(
  '/:id/peserta/me',
  authentication,
  authorization(['mahasiswa']),
  beasiswaController.getParticipantMe
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
  authorization(['verifikator']),
  beasiswaController.addDataValue
);
router.post(
  '/:id/peserta/:username/penilai',
  authentication,
  authorization(['admin']),
  beasiswaController.addPenilaiToMahasiswa
)
router.delete(
  '/:id/peserta/:username/penilai',
  authentication,
  authorization(['admin']),
  beasiswaController.deletePenilaiSurvey
)
router.get(
  '/:id/survey',
  authentication,
  authorization(['admin', 'penilai']),
  beasiswaController.getSurveys
);
router.post(
  '/:id/survey/:username',
  authentication,
  authorization(['penilai']),
  beasiswaController.penilaiGiveScore
);
router.get(
  '/:id/survey/:username',
  authentication,
  authorization(['admin', "penilai"]),
  beasiswaController.getSurveysMahasiswa
);
router.get(
  '/:id/seleksi',
  authentication,
  authorization(['admin']),
  beasiswaController.seleksiBeasiswa
);
router.post(
  '/:id/seleksi/save',
  authentication,
  authorization(['admin']),
  beasiswaController.seleksiBeasiswaAndSave
);
router.get(
  '/:id/result',
  authentication,
  authorization(['admin']),
  beasiswaController.getBeasiswaResult
);

module.exports = router;
