const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const uploadImageMiddleware = require('../middlewares/uploadImage.middleware');
const { uploadImage: uploadImageHandler } = require('../controllers/upload.controller');

const router = express.Router();

router.post(
    '/image',
    authMiddleware,
    adminMiddleware,
    uploadImageMiddleware,
    uploadImageHandler
);

module.exports = router;
