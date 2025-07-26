// src/routes/logs.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken, authorizeRoles } = require('../middleware/Auth');

router.get('/', verifyToken, authorizeRoles('HRD'), logController.getActivityLogs);

module.exports = router;