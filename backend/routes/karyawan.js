// src/routes/karyawan.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Semua rute di sini hanya untuk KARYAWAN
router.use(verifyToken, authorizeRoles('KARYAWAN'));

// Rute untuk mendapatkan data dashboard
router.get('/dashboard-summary', reportController.getKaryawanDashboardSummary);

// --- RUTE BARU UNTUK GRAFIK ---
router.get('/claims-per-month', reportController.getKaryawanClaimsPerMonth);
router.get('/claims-status', reportController.getKaryawanClaimsStatus);

module.exports = router;