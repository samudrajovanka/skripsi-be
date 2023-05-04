const router = require('express').Router();
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

const fileController = require('../controllers/fileController');

router.get('/', authentication, fileController.getAll);
router.get('/:id', authentication, fileController.getById);
router.post('/', authentication, authorization("admin"), fileController.create);
router.put('/:id', authentication, authorization("admin"), fileController.updateById);
router.delete('/:id', authentication, authorization("admin"), fileController.deleteById);

module.exports = router;