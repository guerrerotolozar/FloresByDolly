const path = require('path');
const fs = require('fs');

// POST /api/upload — Subir imagen (admin)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ninguna imagen.',
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size,
            },
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({ success: false, message: 'Error subiendo la imagen.' });
    }
};

// DELETE /api/upload/:filename — Eliminar imagen (admin)
exports.deleteImage = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Imagen no encontrada.',
            });
        }

        fs.unlinkSync(filePath);

        res.json({ success: true, message: 'Imagen eliminada.' });
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ success: false, message: 'Error eliminando la imagen.' });
    }
};
