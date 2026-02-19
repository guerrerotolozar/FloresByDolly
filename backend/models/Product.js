const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
        },
        price: {
            type: String,
            default: 'Variable por Temporada',
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'La categoría es obligatoria'],
        },
        image: {
            type: String,
            default: '',
        },
        badgeLabel: {
            type: String,
            default: '',
        },
        badgeClass: {
            type: String,
            default: 'bg-success',
        },
        features: {
            type: [String],
            default: [],
        },
        tags: {
            type: [String],
            default: [],
        },
        whatsappMsg: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
