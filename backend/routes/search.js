// src/routes/search.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Izinkan semua peran yang sudah login untuk melakukan pencarian
router.get('/', verifyToken, authorizeRoles('HRD', 'KARYAWAN', 'KEUANGAN'), searchController.globalSearch);

module.exports = router;