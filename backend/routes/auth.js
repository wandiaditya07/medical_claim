const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authorizeRoles } = require('../middleware/Auth'); // If you want to restrict registration to Admin only

// Public route for user login
router.post('/login', authController.login);

// Example: Registering a new user (might be restricted to Admin only)
router.post('/register', authorizeRoles('ADMIN'), authController.register); // Only Admin can register new users

module.exports = router;