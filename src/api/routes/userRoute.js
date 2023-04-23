const router = require('express').Router();

const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:username', userController.getByUsername);
router.put('/:username', userController.updateByUsername);
router.delete('/:username', userController.deleteByUsername);

module.exports = router;
