const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'La imagen es obligatoria'],
        },
        category: {
            type: String,
            enum: ['local', 'productos', 'arreglos', 'bodas'],
            default: 'productos',
        },
        tags: {
            type: [String],
            default: [],
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

module.exports = mongoose.model('Gallery', gallerySchema);
