const router = require('express').Router();

const authController = require('../controllers/authController');
const authentication = require('../middleware/authentication');

router.post("/login", authController.login);
router.get("/me", authentication, authController.getMe)

module.exports = router;
