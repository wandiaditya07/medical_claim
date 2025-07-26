// src/routes/dependents.js
const express = require('express');
const router = express.Router();
const dependentController = require('../controllers/dependentController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Semua rute di sini hanya untuk KARYAWAN
router.use(verifyToken, authorizeRoles('KARYAWAN'));

router.get('/', dependentController.getMyDependents);
// router.post('/', dependentController.addMyDependent);
// router.put('/:id', dependentController.updateMyDependent);
// router.delete('/:id', dependentController.deleteMyDependent);

module.exports = router;