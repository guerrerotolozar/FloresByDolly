const Product = require('../models/Product');

// GET /api/products — Listar todos (público, con filtro opcional)
exports.getAll = async (req, res) => {
    try {
        const filter = {};

        // Filtro por categoría (query param)
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Solo activos para público, todos para admin
        if (!req.query.showAll) {
            filter.isActive = true;
        }

        const products = await Product.find(filter)
            .populate('category', 'name slug icon')
            .sort({ order: 1, createdAt: -1 });

        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// GET /api/products/:id — Detalle
exports.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug icon');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// POST /api/products — Crear (admin)
exports.create = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        const populated = await product.populate('category', 'name slug icon');
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        console.error('Error creando producto:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// PUT /api/products/:id — Editar (admin)
exports.update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('category', 'name slug icon');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// DELETE /api/products/:id — Eliminar (admin)
exports.remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }
        res.json({ success: true, message: 'Producto eliminado.' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};
