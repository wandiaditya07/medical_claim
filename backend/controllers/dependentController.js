// src/controllers/dependentController.js
const { pool } = require('../config/db');

const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString().split('T')[0];
};

// GET /api/dependents - Mendapatkan semua tanggungan milik karyawan yang login
exports.getMyDependents = async (req, res) => {
    const { employee_id } = req.user;
    try {
        const [dependents] = await pool.query(
            'SELECT * FROM dependents WHERE employee_id = ? ORDER BY full_name ASC', 
            [employee_id]
        );
        res.status(200).json(dependents);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// POST /api/dependents - Menambahkan tanggungan baru
// exports.addMyDependent = async (req, res) => {
//     const { employee_id } = req.user;
//     const { full_name, relationship, birth_date } = req.body;

//     if (!full_name || !relationship || !birth_date) {
//         return res.status(400).json({ message: 'Semua field wajib diisi.' });
//     }
//     try {
//         const [result] = await pool.query(
//             'INSERT INTO dependents (employee_id, full_name, relationship, birth_date, is_active) VALUES (?, ?, ?, ?, FALSE)',
//             [employee_id, full_name, relationship, formatDate(birth_date)]
//         );
//         res.status(201).json({ message: 'Tanggungan berhasil ditambahkan.', dependentId: result.insertId });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error.' });
//     }
// };

// // PUT /api/dependents/:id - Memperbarui tanggungan
// exports.updateMyDependent = async (req, res) => {
//     const { id: dependentId } = req.params;
//     const { employee_id } = req.user;
//     const { full_name, relationship, birth_date } = req.body;

//     try {
//         // Verifikasi kepemilikan
//         const [dependents] = await pool.query('SELECT employee_id FROM dependents WHERE dependent_id = ?', [dependentId]);
//         if (dependents.length === 0 || dependents[0].employee_id !== employee_id) {
//             return res.status(403).json({ message: 'Akses ditolak.' });
//         }
        
//         await pool.query(
//             'UPDATE dependents SET full_name = ?, relationship = ?, birth_date = ? WHERE dependent_id = ?',
//             [full_name, relationship, formatDate(birth_date), dependentId]
//         );
//         res.status(200).json({ message: 'Tanggungan berhasil diperbarui.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error.' });
//     }
// };

// // DELETE /api/dependents/:id - Menghapus tanggungan
// exports.deleteMyDependent = async (req, res) => {
//     const { id: dependentId } = req.params;
//     const { employee_id } = req.user;

//     try {
//         // Verifikasi kepemilikan
//         const [dependents] = await pool.query('SELECT employee_id FROM dependents WHERE dependent_id = ?', [dependentId]);
//         if (dependents.length === 0 || dependents[0].employee_id !== employee_id) {
//             return res.status(403).json({ message: 'Akses ditolak.' });
//         }

//         await pool.query('DELETE FROM dependents WHERE dependent_id = ?', [dependentId]);
//         res.status(200).json({ message: 'Tanggungan berhasil dihapus.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error.' });
//     }
// };