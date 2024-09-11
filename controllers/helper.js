const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.body.title) {
            cb(null, 'public/post'); // Specify the directory where files will be saved
        } else {
            cb(null, 'public/reply'); // Specify the directory where files will be saved
        }
    },
    filename: function (req, file, cb) {
        const _ = file ? cb(null, req.session.user.userId + Date.now() + path.extname(file.originalname)) : cb(null, ''); // Generate a unique filename
    }
});

// Initialize multer instance
const upload = multer({ storage: storage });

// Function to parse uploaded image and generate URL
const parseImg = (file, path) => {
    if (!file) {
        return null;
    }
    return `/${path}/${file.filename}`; // Return URL path for the uploaded image
};

const deleteImg = (URL)

module.exports = { upload, parseImg };
