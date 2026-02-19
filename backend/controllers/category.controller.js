const Category = require('../models/Category');

// GET /api/categories — Listar todas
exports.getAll = async (req, res) => {
    try {
        const filter = {};
        if (!req.query.showAll) {
            filter.isActive = true;
        }

        const categories = await Category.find(filter).sort({ order: 1 });
        res.json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// POST /api/categories — Crear (admin)
exports.create = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error('Error creando categoría:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ya existe una categoría con ese slug.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// PUT /api/categories/:id — Editar (admin)
exports.update = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ya existe una categoría con ese slug.' });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// DELETE /api/categories/:id — Eliminar (admin)
exports.remove = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
        }
        res.json({ success: true, message: 'Categoría eliminada.' });
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};
