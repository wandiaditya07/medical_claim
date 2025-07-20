const { pool } = require('../config/db');

exports.createClaim = async (req, res) => {
    const {
        dependent_id, claim_date, claim_amount, claim_description,
        receipt_file, receipt_name, insurance_type, bpjs_claim_reference
    } = req.body;
    const employee_id = req.user.user_id; // Get employee_id from JWT payload after authentication

    if (!employee_id || !claim_date || !claim_amount || !insurance_type) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Basic validation (more complex validation should be done here or using a validation library)
    if (claim_amount <= 0) {
        return res.status(400).json({ message: 'Claim amount must be positive' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO medical_claims (
                employee_id, dependent_id, claim_date, claim_amount, claim_description,
                receipt_file, receipt_name, insurance_type, bpjs_claim_reference,
                reimbursed_amount, insurance_covered_amount -- Default to 0, updated by HRD/Finance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_id, dependent_id, claim_date, claim_amount, claim_description,
                receipt_file, receipt_name, insurance_type, bpjs_claim_reference,
                0, 0 // Initial values, to be updated later
            ]
        );
        res.status(201).json({ message: 'Claim submitted successfully', claimId: result.insertId });
    } catch (error) {
        console.error('Error creating claim:', error);
        res.status(500).json({ message: 'Server error during claim submission' });
    }
};

exports.getClaims = async (req, res) => {
    const { role, user_id } = req.user; // Get role and user_id from JWT
    let query = 'SELECT mc.*, e.full_name as employee_name, d.full_name as dependent_name FROM medical_claims mc JOIN employees e ON mc.employee_id = e.employee_id LEFT JOIN dependents d ON mc.dependent_id = d.dependent_id';
    let params = [];

    if (role === 'KARYAWAN') { // Assuming 'KARYAWAN' is a user role in users table (if employees can log in)
                               // Otherwise, employees get their own routes for their claims
        query += ' WHERE mc.employee_id = ?';
        params.push(user_id);
    } else if (role === 'HRD') {
        // HRD sees claims that are 'PENGAJUAN' or 'DISETUJUI_HRD'
        query += ' WHERE mc.status IN (?)';
        params.push(['PENGAJUAN', 'DISETUJUI_HRD', 'DITOLAK_HRD', 'REVISI']);
    } else if (role === 'KEUANGAN') {
        // Keuangan sees claims that are 'DISETUJUI_HRD'
        query += ' WHERE mc.status = ?';
        params.push('DISETUJUI_HRD');
    }
    // Admin sees all claims (no WHERE clause added here)

    query += ' ORDER BY mc.created_at DESC';

    try {
        const [claims] = await pool.query(query, params);
        res.status(200).json(claims);
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ message: 'Server error fetching claims' });
    }
};

exports.getClaimById = async (req, res) => {
    const { id } = req.params;
    const { role, user_id } = req.user;

    try {
        const [claims] = await pool.query(
            `SELECT mc.*, e.full_name as employee_name, d.full_name as dependent_name
             FROM medical_claims mc
             JOIN employees e ON mc.employee_id = e.employee_id
             LEFT JOIN dependents d ON mc.dependent_id = d.dependent_id
             WHERE mc.claim_id = ?`,
            [id]
        );

        if (claims.length === 0) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        const claim = claims[0];

        // Authorization check: Only employee owner, HRD, Keuangan, or Admin can view
        if (role === 'KARYAWAN' && claim.employee_id !== user_id) {
            return res.status(403).json({ message: 'Access Denied: You are not authorized to view this claim' });
        }

        res.status(200).json(claim);
    } catch (error) {
        console.error('Error fetching claim by ID:', error);
        res.status(500).json({ message: 'Server error fetching claim' });
    }
};

exports.updateClaimStatusHRD = async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body; // status should be 'DISETUJUI_HRD' or 'DITOLAK_HRD'
    const hrd_user_id = req.user.user_id;

    if (!['DISETUJUI_HRD', 'DITOLAK_HRD', 'REVISI'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status for HRD update' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE medical_claims
             SET status = ?, approved_at = ?, approved_by_hr = ?, claim_description = ? -- Update description if status is 'REVISI' to clarify
             WHERE claim_id = ? AND status = 'PENGAJUAN'`,
            [status, new Date(), hrd_user_id, note, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Claim not found or not in PENGajuan status' });
        }
        res.status(200).json({ message: `Claim status updated to ${status} by HRD` });
    } catch (error) {
        console.error('Error updating claim status by HRD:', error);
        res.status(500).json({ message: 'Server error updating claim status' });
    }
};

exports.updateClaimStatusFinance = async (req, res) => {
    const { id } = req.params;
    const { status, reimbursed_amount, insurance_covered_amount, note } = req.body;
    const finance_user_id = req.user.user_id;

    if (status !== 'DIBAYARKAN_KEUANGAN') {
        return res.status(400).json({ message: 'Invalid status for Finance update' });
    }
    if (typeof reimbursed_amount === 'undefined' || typeof insurance_covered_amount === 'undefined') {
        return res.status(400).json({ message: 'Reimbursed and insurance covered amounts are required' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE medical_claims
             SET status = ?, paid_at = ?, paid_by_finance = ?,
             reimbursed_amount = ?, insurance_covered_amount = ?
             WHERE claim_id = ? AND status = 'DISETUJUI_HRD'`,
            [status, new Date(), finance_user_id, reimbursed_amount, insurance_covered_amount, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Claim not found or not approved by HRD' });
        }
        res.status(200).json({ message: 'Claim status updated to DIBAYARKAN_KEUANGAN by Finance' });
    } catch (error) {
        console.error('Error updating claim status by Finance:', error);
        res.status(500).json({ message: 'Server error updating claim status' });
    }
};

// Admin/HRD can delete claims (use with caution!)
exports.deleteClaim = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM medical_claims WHERE claim_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Claim not found' });
        }
        res.status(200).json({ message: 'Claim deleted successfully' });
    } catch (error) {
        console.error('Error deleting claim:', error);
        res.status(500).json({ message: 'Server error deleting claim' });
    }
};