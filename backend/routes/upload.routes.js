const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// POST /api/upload — Subir imagen (admin)
router.post('/', authMiddleware, upload.single('image'), uploadController.uploadImage);

// DELETE /api/upload/:filename — Eliminar imagen (admin)
router.delete('/:filename', authMiddleware, uploadController.deleteImage);

module.exports = router;
