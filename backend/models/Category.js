const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;