const jwt = require('jsonwebtoken');

// Generate OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP
const generateOtpExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
};

module.exports = {
    generateOtp,
    generateOtpExpiry
};
