const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Públicas
router.get('/', categoryController.getAll);

// Protegidas (admin)
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.remove);

module.exports = router;
