// src/routes/keuangan.js
const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Semua rute di sini hanya untuk KEUANGAN
router.use(verifyToken, authorizeRoles('KEUANGAN'));

router.get('/dashboard-summary', reportController.getKeuanganDashboardSummary);
router.get('/claims-for-payment', claimController.getClaimsForPayment);
router.get('/payment-history', claimController.getPaidClaimsHistory);

module.exports = router;