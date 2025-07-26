// src/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Tentukan lokasi penyimpanan dan nama file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pastikan folder 'uploads/' ada di root backend
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter untuk hanya menerima tipe file gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Hanya file JPG, PNG, dan PDF yang diizinkan!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // Batas ukuran file 2MB
    },
    fileFilter: fileFilter
});

module.exports = upload;