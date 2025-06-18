import express from 'express';
import { createUser, login, getCurrentUser } from '../controllers/users.js';
import { validateLogin, validateUserCreation } from '../validators/validators.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/me', auth, getCurrentUser);
router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreation, createUser); // Simplified

export default router;