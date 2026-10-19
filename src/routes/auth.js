const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me (protected route)
router.get('/me', protect, authController.getMe);

// GET /api/auth/logout (protected route)
router.get('/logout', protect, authController.logout);

module.exports = router;