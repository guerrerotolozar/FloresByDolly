const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const registroController = require('../controllers/registro.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Limitador de abuso y scraping masivo para registro en rifa
const registroLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Has realizado demasiados intentos de registro. Por favor espera unos minutos.'
    }
});

// POST /api/registro — Público (desde el formulario de la rifa) con rate limit
router.post('/', registroLimiter, registroController.registrar);

// GET /api/registro — Protegido (solo admin puede ver la lista)
router.get('/', authMiddleware, registroController.listar);

// GET /api/registro/stats — Protegido (estadísticas rápidas)
router.get('/stats', authMiddleware, registroController.stats);

// DELETE /api/registro/:id — Protegido (desactivar registro)
router.delete('/:id', authMiddleware, registroController.eliminar);

module.exports = router;
