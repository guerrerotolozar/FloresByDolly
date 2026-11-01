const mongoose = require('mongoose');

const referidoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
    },
    celular: {
        type: String,
        trim: true,
    },
});

const registroVipSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        celular: {
            type: String,
            required: [true, 'El celular es obligatorio'],
            trim: true,
            match: [/^\d{10}$/, 'El celular debe tener exactamente 10 dígitos'],
        },
        referidos: [referidoSchema],
        activo: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // createdAt y updatedAt automáticos
    }
);

// Índice único por celular para evitar duplicados
registroVipSchema.index({ celular: 1 }, { unique: true });

module.exports = mongoose.model('RegistroVip', registroVipSchema);
