const router = require('express').Router();
const galleryController = require('../controllers/gallery.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Públicas
router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);

// Protegidas (admin)
router.post('/', authMiddleware, galleryController.create);
router.put('/:id', authMiddleware, galleryController.update);
router.delete('/:id', authMiddleware, galleryController.remove);

module.exports = router;
