const router = require('express').Router();

const pengumumanController = require('../controllers/pengumumanController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const { upload } = require('../middleware/uploadFile');

router.post(
  '/',
  authentication,
  authorization(['admin']),
  upload('pdf')('array', ['files', 3]),
  pengumumanController.create
);
router.get(
  '/',
  authentication,
  pengumumanController.getAll
);
router.get(
  '/:id',
  authentication,
  pengumumanController.getById
);
router.delete(
  '/:id',
  authentication,
  authorization(['admin']),
  pengumumanController.delete
)
router.put(
  '/:id',
  authentication,
  authorization(['admin']),
  upload('pdf')('array', ['files', 3]),
  pengumumanController.updateById
);

module.exports = router;
