// src/routes/employees.js
const express = require('express');
const router = express.Router();
const employeeDataController = require('../controllers/employeeDataController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Apply JWT verification and HRD authorization to all employee data routes
router.use(verifyToken);
router.use(authorizeRoles('HRD')); // Hanya HRD yang bisa mengakses manajemen data karyawan

// GET all employees
router.get('/', employeeDataController.getAllEmployees);

// CREATE new employee
router.post('/', employeeDataController.createEmployee);

// GET employee detail (with dependents)
router.get('/:id/details', employeeDataController.getEmployeeDetail);

// UPDATE employee
router.put('/:id', employeeDataController.updateEmployee);

// DELETE employee
router.delete('/:id', employeeDataController.deleteEmployee);


// --- Dependent Routes (nested under employee management for clarity) ---
// CREATE dependent for a specific employee
router.post('/:employeeId/dependents', employeeDataController.createDependent);

// UPDATE dependent
router.put('/dependents/:id', employeeDataController.updateDependent);

// DELETE dependent
router.delete('/dependents/:id', employeeDataController.deleteDependent);

module.exports = router;