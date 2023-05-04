const router = require('express').Router();

const userController = require('../controllers/userController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

router.post('/', authentication, authorization(['admin']), userController.createUser);
router.get('/', authentication, authorization(['admin']), userController.getAllUsers);
router.get('/:username', userController.getByUsername);
router.put('/:username', authentication, authorization(['admin']), userController.updateByUsername);
router.delete('/:username', authentication, authorization(['admin']), userController.deleteByUsername);

module.exports = router;
