const router = require('express').Router();

const mahasiswaController = require('../controllers/mahasiswaController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

router.post('/', authentication, authorization(['admin']), mahasiswaController.createMahasiswa);
router.get('/', authentication, mahasiswaController.getAllMahasiswa);
router.get('/:username', authentication, mahasiswaController.getByUsername);
router.put('/:username', authentication, authorization(['admin']), mahasiswaController.updateByUsername);
router.delete('/:username', authentication, authorization(['admin']), mahasiswaController.deleteByUsername);

module.exports = router;
