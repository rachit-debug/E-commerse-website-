const cloudinary = require('../config/cloudinary');

function uploadBufferToCloudinary(buffer) {
    const folder =
        process.env.CLOUDINARY_UPLOAD_FOLDER || 'ecommerce-app';

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

exports.uploadImage = async (req, res) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(503).json({
                message:
                    'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
            });
        }

        if (!req.file?.buffer) {
            return res.status(400).json({
                message:
                    'No image received. Use field name "image" with a JPEG, PNG, GIF, or WebP file (max 5MB).',
            });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);
        res.status(200).json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Cloudinary upload failed',
        });
    }
};
