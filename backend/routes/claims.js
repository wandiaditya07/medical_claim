// src/routes/claims.js
const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');
const upload = require('../middleware/upload');

// Middleware ini berlaku untuk semua rute di file ini
router.use(verifyToken);

// --- Rute Umum & Karyawan ---
router.get('/', claimController.getClaims);
router.get('/for-approval', authorizeRoles('HRD'), claimController.getClaimsForApproval); 
router.get('/:id', claimController.getClaimById);
router.post('/', authorizeRoles('KARYAWAN'), upload.single('receipt_file'), claimController.createClaim);
router.delete('/:id', authorizeRoles('HRD'), claimController.deleteClaim);

// --- Rute Khusus Persetujuan HRD ---
// HAPUS verifyToken dari sini
router.put('/:id/approve', authorizeRoles('HRD'), claimController.approveClaim);
router.put('/:id/reject', authorizeRoles('HRD'), claimController.rejectClaim);

// --- Rute Khusus Keuangan ---
router.put('/:id/pay', authorizeRoles('KEUANGAN'), claimController.payClaim);

module.exports = router;