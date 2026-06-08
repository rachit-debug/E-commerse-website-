const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    },
    phoneNumber: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: String,
        trim: true,
    },
    otp:{
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

module.exports = User;