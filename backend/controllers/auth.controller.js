const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username y contraseña son obligatorios.',
            });
        }

        // Buscar usuario
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.',
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.',
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};
