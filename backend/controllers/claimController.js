const { pool } = require('../config/db');

// --- UNTUK KARYAWAN ---

// POST /api/claims
exports.createClaim = async (req, res) => {
    const { dependent_id, claim_date, claim_amount, claim_description } = req.body;
    const { user_id, employee_id } = req.user;
    const receipt_file = req.file ? req.file.path : null;

    if (!employee_id || !claim_date || !claim_amount) {
        return res.status(400).json({ message: 'Tanggal, jumlah, dan data karyawan wajib diisi.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO medical_claims (employee_id, dependent_id, claim_date, claim_amount, claim_description, receipt_file, status)
             VALUES (?, ?, ?, ?, ?, ?, 'PENGAJUAN')`,
            [employee_id, dependent_id || null, claim_date, claim_amount, claim_description, receipt_file]
        );
        const newClaimId = result.insertId;

        const [employees] = await connection.query('SELECT full_name FROM employees WHERE employee_id = ?', [employee_id]);
        const employeeName = employees[0].full_name;

        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [user_id, 'CREATE_CLAIM', `Karyawan "${employeeName}" mengajukan klaim baru #${newClaimId} sejumlah Rp ${claim_amount}`]
        );

        await connection.commit();
        res.status(201).json({ message: 'Klaim berhasil diajukan.', claimId: newClaimId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error creating claim:', error);
        res.status(500).json({ message: 'Server error saat mengajukan klaim.' });
    } finally {
        if (connection) connection.release();
    }
};

// --- FUNGSI UMUM ---

// GET /api/claims
exports.getClaims = async (req, res) => {
    const { role, employee_id } = req.user;
    let query = `SELECT mc.claim_id, mc.claim_date, mc.claim_amount, mc.status, e.full_name as employee_name, d.full_name as dependent_name 
                 FROM medical_claims mc 
                 JOIN employees e ON mc.employee_id = e.employee_id
                 LEFT JOIN dependents d ON mc.dependent_id = d.dependent_id`;
    let params = [];

    if (role === 'KARYAWAN') {
        query += ' WHERE mc.employee_id = ?';
        params.push(employee_id);
    }
    query += ' ORDER BY mc.claim_date DESC';

    try {
        const [claims] = await pool.query(query, params);
        res.status(200).json(claims);
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ message: 'Server error saat mengambil data klaim.' });
    }
};

// GET /api/claims/:id
exports.getClaimById = async (req, res) => {
    const { id } = req.params;
    const { role, employee_id } = req.user;

    try {
        const [claims] = await pool.query(
            `SELECT mc.*, e.full_name as employee_name, d.full_name as dependent_name
             FROM medical_claims mc
             JOIN employees e ON mc.employee_id = e.employee_id
             LEFT JOIN dependents d ON mc.dependent_id = d.dependent_id
             WHERE mc.claim_id = ?`, [id]
        );
        if (claims.length === 0) {
            return res.status(404).json({ message: 'Klaim tidak ditemukan.' });
        }
        const claim = claims[0];
        if (role === 'KARYAWAN' && claim.employee_id !== employee_id) {
            return res.status(403).json({ message: 'Akses ditolak.' });
        }
        res.status(200).json(claim);
    } catch (error) {
        console.error('Error fetching claim by ID:', error);
        res.status(500).json({ message: 'Server error saat mengambil detail klaim.' });
    }
};

// --- UNTUK HRD ---

// GET /api/claims/for-approval
exports.getClaimsForApproval = async (req, res) => {
    try {
        const [claims] = await pool.query(
            `SELECT mc.*, e.full_name AS employee_name, d.full_name AS dependent_name, d.relationship AS dependent_relationship
             FROM medical_claims mc
             JOIN employees e ON mc.employee_id = e.employee_id
             LEFT JOIN dependents d ON mc.dependent_id = d.dependent_id
             WHERE mc.status = 'PENGAJUAN' ORDER BY mc.claim_date ASC`
        );
        res.status(200).json(claims);
    } catch (error) {
        console.error('Error fetching claims for approval:', error);
        res.status(500).json({ message: 'Server error fetching claims.' });
    }
};

// PUT /api/claims/:id/approve
exports.approveClaim = async (req, res) => {
    const { id: claimId } = req.params;
    const { note } = req.body;
    const approverId = req.user.user_id;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Ambil employee_id dan nama karyawan dari klaim
        const [claims] = await connection.query(
            'SELECT mc.employee_id, e.full_name FROM medical_claims mc JOIN employees e ON mc.employee_id = e.employee_id WHERE mc.claim_id = ?',
            [claimId]
        );
        if (claims.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Claim not found.'});
        }
        const { employee_id, full_name: employeeName } = claims[0];

        const [updateResult] = await connection.query(
            "UPDATE medical_claims SET status = 'DISETUJUI_HRD' WHERE claim_id = ? AND status = 'PENGAJUAN'",
            [claimId]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Claim not found or already processed.' });
        }

        // PERBAIKAN: Tambahkan employee_id ke dalam INSERT
        await connection.query(
            `INSERT INTO claim_approvals (claim_id, employee_id, approver_id, approval_role, status, note) VALUES (?, ?, ?, 'HRD', 'APPROVED', ?)`,
            [claimId, employee_id, approverId, note || 'Disetujui oleh HRD']
        );

        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [approverId, 'APPROVE_CLAIM', `Menyetujui klaim #${claimId} untuk karyawan "${employeeName}"`]
        );

        await connection.commit();
        res.status(200).json({ message: 'Claim has been approved.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error approving claim:', error);
        res.status(500).json({ message: 'Server error while approving claim.' });
    } finally {
        if (connection) connection.release();
    }
};

// PUT /api/claims/:id/reject
exports.rejectClaim = async (req, res) => {
    const { id: claimId } = req.params;
    const { note } = req.body;
    const approverId = req.user.user_id;

    if (!note) {
        return res.status(400).json({ message: 'Alasan (note) wajib diisi untuk menolak klaim.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [claims] = await connection.query(
            'SELECT mc.employee_id, e.full_name FROM medical_claims mc JOIN employees e ON mc.employee_id = e.employee_id WHERE mc.claim_id = ?',
            [claimId]
        );
        if (claims.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Claim not found.'});
        }
        const { employee_id, full_name: employeeName } = claims[0];

        const [updateResult] = await connection.query(
            "UPDATE medical_claims SET status = 'DITOLAK_HRD' WHERE claim_id = ? AND status = 'PENGAJUAN'",
            [claimId]
        );
        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Claim not found or already processed.' });
        }

        // PERBAIKAN: Tambahkan employee_id ke dalam INSERT
        await connection.query(
            `INSERT INTO claim_approvals (claim_id, employee_id, approver_id, approval_role, status, note) VALUES (?, ?, ?, 'HRD', 'REJECTED', ?)`,
            [claimId, employee_id, approverId, note]
        );

        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [approverId, 'REJECT_CLAIM', `Menolak klaim #${claimId} untuk karyawan "${employeeName}"`]
        );

        await connection.commit();
        res.status(200).json({ message: 'Claim has been rejected.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error rejecting claim:', error);
        res.status(500).json({ message: 'Server error while rejecting claim.' });
    } finally {
        if (connection) connection.release();
    }
};

// DELETE /api/claims/:id
exports.deleteClaim = async (req, res) => {
    const { id: claimId } = req.params;
    const actorId = req.user.user_id;
    try {
        const [result] = await pool.query('DELETE FROM medical_claims WHERE claim_id = ?', [claimId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Klaim tidak ditemukan.' });
        }
        await pool.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [actorId, 'DELETE_CLAIM', `Menghapus data klaim #${claimId}`]
        );
        res.status(200).json({ message: 'Klaim berhasil dihapus.' });
    } catch (error) {
        console.error('Error deleting claim:', error);
        res.status(500).json({ message: 'Server error saat menghapus klaim.' });
    }
};

// --- UNTUK KEUANGAN ---

// PUT /api/claims/:id/pay
exports.payClaim = async (req, res) => {
    const { id: claimId } = req.params;
    const { note } = req.body;
    const approverId = req.user.user_id;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [claims] = await connection.query(
            `SELECT mc.employee_id, mc.claim_date, mc.claim_amount, e.full_name AS employee_name 
             FROM medical_claims mc JOIN employees e ON mc.employee_id = e.employee_id
             WHERE mc.claim_id = ? AND mc.status = 'DISETUJUI_HRD'`,
            [claimId]
        );

        if (claims.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Claim not found or not yet approved by HRD.' });
        }
        const claim = claims[0];
        const claimYear = new Date(claim.claim_date).getFullYear();

        await connection.query("UPDATE medical_claims SET status = 'DIBAYARKAN_KEUANGAN' WHERE claim_id = ?", [claimId]);

        await connection.query(
            "UPDATE claim_limits SET used_amount = used_amount + ? WHERE employee_id = ? AND year = ?",
            [claim.claim_amount, claim.employee_id, claimYear]
        );

        // PERBAIKAN: Tambahkan employee_id ke dalam INSERT
        await connection.query(
            `INSERT INTO claim_approvals (claim_id, employee_id, approver_id, approval_role, status, note) VALUES (?, ?, ?, 'KEUANGAN', 'APPROVED', ?)`,
            [claimId, claim.employee_id, approverId, note || 'Telah dibayarkan oleh Keuangan']
        );
        
        await connection.query(
            'INSERT INTO activity_logs (user_id, action_type, details) VALUES (?, ?, ?)',
            [approverId, 'PAY_CLAIM', `Membayarkan klaim #${claimId} untuk ${claim.employee_name} sejumlah Rp ${claim.claim_amount}`]
        );

        await connection.commit();
        res.status(200).json({ message: 'Claim has been paid and recorded.' });
        
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error paying claim:', error);
        res.status(500).json({ message: 'Server error while paying claim.' });
    } finally {
        if (connection) connection.release();
    }
};

// GET /api/keuangan/claims-for-payment
exports.getClaimsForPayment = async (req, res) => {
    try {
        const [claims] = await pool.query(
            `SELECT 
                mc.claim_id,
                mc.claim_date,
                mc.claim_amount,
                mc.status,
                mc.receipt_file, -- <-- Tambahkan kolom ini
                e.full_name AS employee_name
             FROM medical_claims mc
             JOIN employees e ON mc.employee_id = e.employee_id
             WHERE mc.status = 'DISETUJUI_HRD' ORDER BY mc.claim_date ASC`
        );
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/keuangan/payment-history
exports.getPaidClaimsHistory = async (req, res) => {
    try {
        const [claims] = await pool.query(
            `SELECT mc.*, e.full_name AS employee_name
             FROM medical_claims mc
             JOIN employees e ON mc.employee_id = e.employee_id
             WHERE mc.status = 'DIBAYARKAN_KEUANGAN' ORDER BY mc.updated_at DESC`
        );
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};