const router = require('express').Router();

const mahasiswaController = require('../controllers/mahasiswaController');

router.post('/', mahasiswaController.createMahasiswa);
router.get('/', mahasiswaController.getAllMahasiswa);
router.get('/:username', mahasiswaController.getByUsername);
router.put('/:username', mahasiswaController.updateByUsername);
router.delete('/:username', mahasiswaController.deleteByUsername);

module.exports = router;
