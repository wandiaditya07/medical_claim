const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

exports.register = async (req, res) => {
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existingUser] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10); // Cost factor 10
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            [username, password_hash, full_name, role]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [users] = await pool.query('SELECT user_id, password_hash, role, full_name FROM users WHERE username = ? AND is_active = TRUE', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, full_name: user.full_name },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        res.status(200).json({ message: 'Login successful', token, role: user.role, full_name: user.full_name });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};