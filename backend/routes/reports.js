// src/routes/reports.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Semua rute laporan hanya bisa diakses oleh HRD (sebagai peran superior) atau KEUANGAN
router.use(verifyToken);
router.use(authorizeRoles('HRD', 'KEUANGAN')); // Misalnya Keuangan juga bisa lihat laporan

// GET HRD Dashboard Summary Data
router.get('/hrd-summary', reportController.getHrdDashboardSummary);

// GET Claims Per Month for Bar Chart
router.get('/claims-per-month', reportController.getClaimsPerMonth);

// GET Claims Status for Pie Chart
router.get('/claims-status', reportController.getClaimsStatus);

module.exports = router;