// src/controllers/searchController.js
const { pool } = require('../config/db');

exports.globalSearch = async (req, res) => {
    const { q: query } = req.query; // Ambil query pencarian dari URL (?q=...)
    const actorRole = req.user.role;
    const actorEmployeeId = req.user.employee_id;

    if (!query) {
        return res.status(400).json({ message: 'Query pencarian tidak boleh kosong.' });
    }

    try {
        const searchQuery = `%${query}%`;

        // Jalankan semua query pencarian secara paralel
        const [employeeResults, dependentResults, claimResults] = await Promise.all([
            // Cari di tabel karyawan berdasarkan nama atau NIK
            pool.query(
                'SELECT employee_id as id, full_name as title, "Karyawan" as type, employee_nik as description FROM employees WHERE full_name LIKE ? OR employee_nik LIKE ?',
                [searchQuery, searchQuery]
            ),
            // Cari di tabel tanggungan berdasarkan nama
            pool.query(
                'SELECT dependent_id as id, full_name as title, "Tanggungan" as type, relationship as description FROM dependents WHERE full_name LIKE ?',
                [searchQuery]
            ),
            // Cari di tabel klaim berdasarkan ID atau deskripsi
            pool.query(
                'SELECT claim_id as id, claim_description as title, "Klaim Medis" as type, status as description FROM medical_claims WHERE claim_id = ? OR claim_description LIKE ?',
                [query, searchQuery]
            )
        ]);
        
        // Gabungkan semua hasil
        let combinedResults = [
            ...employeeResults[0],
            ...dependentResults[0],
            ...claimResults[0]
        ];

        // Jika yang mencari adalah KARYAWAN, filter agar hanya menampilkan data mereka sendiri
        if (actorRole === 'KARYAWAN') {
            const [myDependents] = await pool.query('SELECT dependent_id FROM dependents WHERE employee_id = ?', [actorEmployeeId]);
            const myDependentIds = myDependents.map(d => d.id);

            combinedResults = combinedResults.filter(result => {
                if (result.type === 'Karyawan' && result.id === actorEmployeeId) return true;
                if (result.type === 'Tanggungan' && myDependentIds.includes(result.id)) return true;
                // Karyawan tidak bisa mencari klaim via global search untuk saat ini
                return false;
            });
        }

        res.status(200).json(combinedResults);

    } catch (error) {
        console.error("Error during global search:", error);
        res.status(500).json({ message: 'Server error during search.' });
    }
};