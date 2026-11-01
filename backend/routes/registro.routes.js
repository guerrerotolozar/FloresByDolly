const router = require('express').Router();
const registroController = require('../controllers/registro.controller');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/registro — Público (desde el formulario de la rifa)
router.post('/', registroController.registrar);

// GET /api/registro — Protegido (solo admin puede ver la lista)
router.get('/', authMiddleware, registroController.listar);

// GET /api/registro/stats — Protegido (estadísticas rápidas)
router.get('/stats', authMiddleware, registroController.stats);

// DELETE /api/registro/:id — Protegido (desactivar registro)
router.delete('/:id', authMiddleware, registroController.eliminar);

module.exports = router;
