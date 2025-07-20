const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const { pool } = require('../config/db');

// Middleware untuk memverifikasi token JWT
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Access Denied: Invalid token' });
        }
        req.user = user; // user object from JWT payload (e.g., { user_id: 1, role: 'HRD' })
        next();
    });
};

// Middleware untuk memeriksa peran pengguna
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access Denied: User role not found' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: You do not have permission for this action' });
        }
        next();
    };
};