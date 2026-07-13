const express = require('express');
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
