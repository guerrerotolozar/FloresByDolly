const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Almacenamiento en Cloudinary (en la nube, no en disco local)
// Las imágenes persisten entre deploys y se sirven desde CDN
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'floresbydolly', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, PNG, WebP, GIF)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
});

module.exports = upload;
