const joi = require('joi');

// User Registration Validation Schema
const userRegistrationSchema = joi.object({
    name: joi.string().trim().min(3).max(50).required(),
    email: joi.string().trim().lowercase().email().required(),
    password: joi.string().min(6).required(),
});

module.exports = {
    userRegistrationSchema
};
