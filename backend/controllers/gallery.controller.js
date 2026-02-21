const Gallery = require('../models/Gallery');

// GET /api/gallery — Listar todas (público: solo activas, admin: todas)
exports.getAll = async (req, res) => {
    try {
        const filter = {};

        // Solo activas para público, todas para admin
        if (!req.query.showAll) {
            filter.isActive = true;
        }

        // Filtro por categoría
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error('Error obteniendo galería:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// GET /api/gallery/:id — Detalle
exports.getById = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        console.error('Error obteniendo imagen:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// POST /api/gallery — Crear (admin)
exports.create = async (req, res) => {
    try {
        const item = await Gallery.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        console.error('Error creando imagen de galería:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// PUT /api/gallery/:id — Editar (admin)
exports.update = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        console.error('Error actualizando imagen:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// DELETE /api/gallery/:id — Eliminar (admin)
exports.remove = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
        }
        res.json({ success: true, message: 'Imagen eliminada.' });
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};
