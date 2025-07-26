// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Public route for user login (menggunakan email)
router.post('/login', authController.login);

// Register a new user (only ADMIN or HRD can do this)
// Ini adalah untuk membuat akun user secara manual oleh admin/HRD
router.post('/register', verifyToken, authorizeRoles('HRD'), authController.register);

// HAPUS route '/activate' yang public, karena aktivasi dilakukan oleh HRD
// router.post('/activate', authController.activateAccount); // Hapus baris ini

module.exports = router;