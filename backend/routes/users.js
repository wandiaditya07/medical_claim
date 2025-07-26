// src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Pastikan ini diimpor
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

// Apply JWT verification to all user management routes
router.use(verifyToken);

router.get('/me', userController.getCurrentUser);

// Route untuk ADMIN/HRD mengatur password awal/mengaktivasi akun karyawan
// user_id yang diupdate ada di req.body.userIdToUpdate
router.put('/set-initial-password', authorizeRoles('HRD'), userController.setInitialPasswordForUser);

// Route untuk user (karyawan) mengubah password mereka sendiri
router.put('/change-password', userController.changePassword);

// Route untuk mendapatkan detail user by ID (dengan otorisasi)
router.get('/:id', userController.getUserById);

// Route untuk mendapatkan daftar semua users (untuk Admin/HRD)
router.get('/', authorizeRoles('HRD'), userController.getAllUsers);

// PUT /api/users/:userId/activate
router.put('/:userId/activate',verifyToken,authorizeRoles('HRD'), // Hanya HRD yang bisa
userController.activateUserAndEmployeeStatus
);

// PUT /api/users/:userId/change-password
router.put('/:userId/change-password',verifyToken,authorizeRoles('HRD'), // Hanya HRD
    userController.changePasswordByHRD
);



module.exports = router;