const router = require('express').Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Públicas
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protegidas (admin)
router.post('/', authMiddleware, productController.create);
router.put('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.remove);

module.exports = router;
