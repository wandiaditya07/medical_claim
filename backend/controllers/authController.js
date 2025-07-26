// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

// --- Fungsi Register (Untuk ADMIN/HRD membuat akun user baru) ---
// Note: Ini bisa dipakai HRD untuk membuat akun KARYAWAN, ADMIN, HRD, KEUANGAN
// Ketika role KARYAWAN, password bisa null (akan diatur nanti oleh HRD via setInitialPasswordForUser)
exports.register = async (req, res) => {
    const { email, password, full_name, role } = req.body;
    // Karyawan tidak dibuat di sini
    if (role === 'KARYAWAN') {
        return res.status(400).json({ message: 'Employee accounts should be created via the /api/employees endpoint, not here.' });
    }
    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: 'Email, password, full name, and role are required.' });
    }

    try {
        const [existingUser] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)',
            [email, password_hash, full_name, role, true] // User non-karyawan langsung aktif
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// --- Fungsi Login ---
exports.login = async (req, res) => {
    const { email, password } = req.body; // Menggunakan email
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        // KODE BARU DENGAN PERBAIKAN
const [users] = await pool.query(
    `SELECT
        u.user_id,
        u.password_hash,
        u.role,
        u.full_name,
        u.is_active,
        e.employee_id
     FROM
        users u
     LEFT JOIN
        employees e ON u.user_id = e.user_id
     WHERE
        u.email = ? AND u.is_active = TRUE`,
    [email]
);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials or user not found' });
        }

        const user = users[0];

        // Cek apakah akun aktif
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is not active. Please contact HRD for activation.' });
        }

        // Cek apakah password_hash sudah diatur (tidak NULL)
        if (!user.password_hash) {
             return res.status(403).json({ message: 'Account password not set. Please contact HRD for initial password setup.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, full_name: user.full_name, employee_id: user.employee_id },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user_id: user.user_id, // <--- TAMBAHKAN BARIS INI
            role: user.role,
            full_name: user.full_name,
            employee_id: user.employee_id
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};