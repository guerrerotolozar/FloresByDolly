const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me (protegida)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
