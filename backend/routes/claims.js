const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Apply JWT verification to all claim routes
router.use(verifyToken);

// GET all claims (filtered by role in controller)
router.get('/', claimController.getClaims);

// GET claim by ID
router.get('/:id', claimController.getClaimById);

// POST new claim (only Employees or specific user role can create)
// Note: req.user.user_id will be available from verifyToken middleware for employee_id
router.post('/', authorizeRoles('KARYAWAN'), claimController.createClaim);

// UPDATE claim status by HRD
router.put('/:id/status/hrd', authorizeRoles('HRD'), claimController.updateClaimStatusHRD);

// UPDATE claim status by Finance (payment)
router.put('/:id/status/finance', authorizeRoles('KEUANGAN'), claimController.updateClaimStatusFinance);

// DELETE claim (only Admin or HRD can delete)
router.delete('/:id', authorizeRoles('ADMIN', 'HRD'), claimController.deleteClaim);

module.exports = router;