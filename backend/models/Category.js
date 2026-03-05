const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la categoría es obligatorio'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        icon: {
            type: String,
            default: 'fas fa-leaf',
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        showOnHome: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '#13592a',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', categorySchema);
