// src/controllers/userController.js
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// --- UNTUK HRD ---

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT user_id, email, full_name, role, is_active FROM users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users list.' });
    }
};

exports.activateUserAndEmployeeStatus = async (req, res) => {
    const { userId } = req.params;
    const { new_password } = req.body;
    const actorId = req.user.user_id;

    if (!new_password) {
        return res.status(400).json({ message: 'New password is required.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [users] = await connection.query('SELECT full_name FROM users WHERE user_id = ?', [userId]);
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'User not found.'});
        }
        const userName = users[0].full_name;
        
        const [employees] = await connection.query('SELECT employee_id FROM employees WHERE user_id = ?', [userId]);
        if (employees.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Employee record not found for this user.' });
        }
        const employeeId = employees[0].employee_id;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        await connection.query('UPDATE users SET password_hash = ?, is_active = TRUE WHERE user_id = ?', [hashedPassword, userId]);
        await connection.query('UPDATE employees SET is_active = TRUE WHERE employee_id = ?', [employeeId]);
        await connection.query('UPDATE dependents SET is_active = TRUE WHERE employee_id = ?', [employeeId]);
        
        // --- LOGIKA PLAFON BERTINGKAT ---
        const currentYear = new Date().getFullYear();
        const [existingLimit] = await connection.query(
            'SELECT limit_id FROM claim_limits WHERE employee_id = ? AND year = ?',
            [employeeId, currentYear]
        );

        if (existingLimit.length === 0) {
            // 1. Cek jumlah tanggungan
            const [dependents] = await connection.query(
                'SELECT COUNT(*) as total FROM dependents WHERE employee_id = ?',
                [employeeId]
            );

            // 2. Tentukan jumlah plafon berdasarkan status keluarga
            let maxClaimAmount = 10000000; // Plafon default untuk lajang (Rp 10 Juta)
            if (dependents[0].total > 0) {
                maxClaimAmount = 15000000; // Plafon untuk yang berkeluarga (Rp 15 Juta)
            }

            // 3. Masukkan data plafon dengan jumlah yang sudah ditentukan
            await connection.query(
                'INSERT INTO claim_limits (employee_id, year, max_claim_amount, used_amount) VALUES (?, ?, ?, ?)',
                [employeeId, currentYear, maxClaimAmount, 0] 
            );
        }
        
        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'ACTIVATE_ACCOUNT', `Mengaktivasi akun dan status karyawan untuk ${userName}`]
        );

        await connection.commit();
        res.status(200).json({ message: 'Account has been successfully activated and claim limit created.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error during account activation:', error);
        res.status(500).json({ message: 'Server error during activation process.' });
    } finally {
        if (connection) connection.release();
    }
};

exports.changePasswordByHRD = async (req, res) => {
    const { userId } = req.params;
    const { old_password, new_password, confirm_password } = req.body;
    const actorId = req.user.user_id;

    if (!old_password || !new_password || !confirm_password) {
        return res.status(400).json({ message: 'Password lama, password baru, dan konfirmasi password diperlukan.' });
    }
    if (new_password !== confirm_password) {
        return res.status(400).json({ message: 'Password baru dan konfirmasi tidak cocok.' });
    }

    try {
        const [users] = await pool.query('SELECT password_hash, full_name FROM users WHERE user_id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(old_password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password lama yang Anda masukkan salah.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);
        
        await pool.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'CHANGE_PASSWORD_BY_HRD', `Mengubah password untuk ${user.full_name}`]
        );

        res.status(200).json({ message: 'Password berhasil diperbarui.' });

    } catch (error) {
        console.error('Error changing password by HRD:', error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
};

// --- UNTUK PENGGUNA YANG LOGIN ---

exports.getCurrentUser = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const [users] = await pool.query(
            `SELECT u.user_id, u.email, u.full_name, u.role, e.employee_nik, e.position, e.department
             FROM users u
             LEFT JOIN employees e ON u.user_id = e.user_id
             WHERE u.user_id = ?`,
            [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.changePassword = async (req, res) => {
    const userId = req.user.user_id;
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json({ message: 'Password lama dan password baru diperlukan.' });
    }

    try {
        const [users] = await pool.query('SELECT password_hash FROM users WHERE user_id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(old_password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password lama salah.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);
        
        await pool.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [userId, 'CHANGE_OWN_PASSWORD', 'Pengguna mengubah password-nya sendiri.']
        );

        res.status(200).json({ message: 'Password berhasil diperbarui.' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error changing password.' });
    }
};


exports.setInitialPasswordForUser = async (req, res) => {
    const { userIdToUpdate, new_password } = req.body;
    const actorId = req.user.user_id;

    if (!userIdToUpdate || !new_password) {
        return res.status(400).json({ message: 'User ID dan password baru wajib diisi.' });
    }

    try {
        const [usersToUpdate] = await pool.query('SELECT email FROM users WHERE user_id = ?', [userIdToUpdate]);
        if (usersToUpdate.length === 0) {
            return res.status(404).json({ message: 'User target tidak ditemukan.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await pool.query(
            'UPDATE users SET password_hash = ?, is_active = TRUE WHERE user_id = ?',
            [hashedPassword, userIdToUpdate]
        );

        await pool.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'SET_INITIAL_PASSWORD', `Mengatur password awal untuk user ${usersToUpdate[0].email}`]
        );

        res.status(200).json({ message: `Password berhasil diatur dan akun diaktivasi untuk user ${usersToUpdate[0].email}.` });
    } catch (error) {
        console.error('Error setting initial password for user:', error);
        res.status(500).json({ message: 'Server error saat mengatur password awal.' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const { user_id: actorId, role: actorRole } = req.user;

    try {
        const [users] = await pool.query(
            'SELECT user_id, email, full_name, role, is_active FROM users WHERE user_id = ?', 
            [id]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];

        // Otorisasi: Admin/HRD bisa lihat semua, user lain hanya bisa lihat diri sendiri
        if (actorRole === 'HRD' || actorId === user.user_id) {
            res.status(200).json(user);
        } else {
            return res.status(403).json({ message: 'Access Denied.' });
        }

    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
};

// src/controllers/userController.js
exports.getCurrentUser = async (req, res) => {
    const userId = req.user.user_id;
    try {
        // Ambil data dari tabel users dan join dengan employees jika ada
        const [users] = await pool.query(
            `SELECT u.user_id, u.email, u.full_name, u.role, 
                    e.employee_nik, e.position, e.department
             FROM users u
             LEFT JOIN employees e ON u.user_id = e.user_id
             WHERE u.user_id = ?`,
            [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};