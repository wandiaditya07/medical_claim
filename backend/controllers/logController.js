// src/controllers/logController.js
const { pool } = require('../config/db');

exports.getActivityLogs = async (req, res) => {
    try {
        const [logs] = await pool.query(
            `SELECT a.action_type, a.details, a.created_at, u.full_name AS user_name
             FROM activity_logs a
             JOIN users u ON a.user_id = u.user_id
             ORDER BY a.created_at DESC
             LIMIT 100` // Batasi 100 log terbaru
        );
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Server error fetching logs.' });
    }
};