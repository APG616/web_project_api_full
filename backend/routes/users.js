const router = require('express').Router();
const { createUser, login, getCurrentUser } = require('../controllers/users');
const { validateLogin, validateUserCreation } = require('../validators/validators');
const auth = require('../middleware/auth');

router.get('/me', auth, getCurrentUser);
router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreation, createUser); // Simplified

module.exports = router;