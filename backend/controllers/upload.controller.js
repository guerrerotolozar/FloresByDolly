const cloudinary = require('../config/cloudinary');

// POST /api/upload — Subir imagen a Cloudinary (admin)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ninguna imagen.',
            });
        }

        // Con Cloudinary, req.file.path es la URL completa de la imagen
        // Ejemplo: https://res.cloudinary.com/dcea1j9yk/image/upload/v123/floresbydolly/flores-123.jpg
        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                url: req.file.path, // URL completa de Cloudinary
                size: req.file.size,
            },
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({ success: false, message: 'Error subiendo la imagen.' });
    }
};

// DELETE /api/upload/:filename — Eliminar imagen de Cloudinary (admin)
exports.deleteImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        // El public_id en Cloudinary es "floresbydolly/nombre-del-archivo" (sin extensión)
        const publicId = `floresbydolly/${filename.replace(/\.[^/.]+$/, '')}`;

        await cloudinary.uploader.destroy(publicId);

        res.json({ success: true, message: 'Imagen eliminada.' });
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ success: false, message: 'Error eliminando la imagen.' });
    }
};
