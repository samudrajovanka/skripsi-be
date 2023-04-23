const router = require('express').Router();

const kriteriaController = require('../controllers/kriteriaController');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

router.post('/', authentication, authorization(['admin']), kriteriaController.create);
router.get('/', authentication, kriteriaController.getAll);
router.get('/:id', authentication, kriteriaController.getById);
router.put('/:id', authentication, authorization(['admin']), kriteriaController.updateById);
router.delete('/:id', authentication, authorization(['admin']), kriteriaController.deleteById);
router.get('/:id/parameter', authentication, kriteriaController.getAllParameter);
router.post(
  '/:id/parameter',
  authentication,
  authorization(['admin']),
  kriteriaController.addParameter
);
router.put(
  '/:id/parameter/:parameterId',
  authentication,
  authorization(['admin']),
  kriteriaController.updateParameterById
);
router.delete(
  '/:id/parameter/:parameterId',
  authentication,
  authorization(['admin']),
  kriteriaController.deleteParameterById
);

module.exports = router;
