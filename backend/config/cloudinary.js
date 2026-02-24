const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary SDK with env credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage — uploads go straight to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Determine folder by upload context (query param or default)
        const context = req.query.folder || 'portfolio';
        return {
            folder: `ayona-portfolio/${context}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            // public_id is auto-generated (uuid-style) by Cloudinary
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        if (
            allowed.test(file.originalname.split('.').pop().toLowerCase()) ||
            allowed.test(file.mimetype)
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpg, png, gif, webp, svg)'));
        }
    },
});

// Helper — delete a previously uploaded Cloudinary asset by its public_id
const deleteFromCloudinary = async (url) => {
    try {
        if (!url || !url.includes('cloudinary.com')) return;
        // Extract public_id from the Cloudinary URL
        // URL format: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<folder/public_id>.<ext>
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (!matches) return;
        const publicId = matches[1];
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.warn('Cloudinary delete warning:', err.message);
    }
};

module.exports = { cloudinary, upload, deleteFromCloudinary };
