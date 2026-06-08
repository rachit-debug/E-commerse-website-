const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description:{
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    mrpPrice: {
        type: Number,
        required: true,
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0  
    },
    images: [{
        type: String,
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    noOfRatings: {
        type: Number,
        default: 0,
        min: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Product = mongoose.model('products', productSchema);

module.exports = Product;