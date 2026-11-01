const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/auth/login
// Limitador anti-fuerza bruta para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Por favor intenta en 15 minutos.'
    }
});

// POST /api/auth/login
router.post('/login', loginLimiter, authController.login);

// GET /api/auth/me (protegida)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
