require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');

// Conectar a MongoDB
connectDB();

const app = express();

// Seguridad HTTP & Proxy Trust para Cloudflare Tunnel
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Middleware
app.use(cors({
    origin: [
        'http://localhost:4200',
        'http://localhost:4000',
        'https://www.floresbydolly.com',
        'https://floresbydolly.com',
        'https://floresbydolly.onrender.com',
        'http://f-floresbydolly.s3-website.us-east-2.amazonaws.com',
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes estáticas desde /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/api/registro', require('./routes/registro.routes'));

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌸 Flores By Dolly API corriendo en puerto ${PORT}`);
    console.log(`   → http://localhost:${PORT}/api/health`);
});
