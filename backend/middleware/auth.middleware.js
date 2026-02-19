const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no proporcionado.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido. Usuario no encontrado.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Inicia sesión de nuevo.',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido.',
        });
    }
};

module.exports = authMiddleware;
