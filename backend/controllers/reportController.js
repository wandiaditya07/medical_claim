// src/controllers/reportController.js
const { pool } = require('../config/db');

// Fungsi pembantu untuk mendapatkan bulan saat ini dalam format angka (1-12)
const getCurrentMonth = () => new Date().getMonth() + 1;
// Fungsi pembantu untuk mendapatkan tahun saat ini
const getCurrentYear = () => new Date().getFullYear();

// --- Get HRD Dashboard Summary Data ---
exports.getHrdDashboardSummary = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Total Karyawan (Active) - Query ini sudah benar
        const [totalEmployeesResult] = await pool.query(
            'SELECT COUNT(*) AS total FROM employees WHERE is_active = TRUE;'
        );
        const totalEmployees = totalEmployeesResult[0].total;

        // Total Klaim Masuk Bulan Ini - Query ini sudah benar
        const [claimsInMonthResult] = await pool.query(
            `SELECT COUNT(*) AS total FROM medical_claims
             WHERE MONTH(claim_date) = ? AND YEAR(claim_date) = ?;`,
            [currentMonth, currentYear]
        );
        const claimsInMonth = claimsInMonthResult[0].total;

        // PERBAIKAN DI SINI: Total Klaim Disetujui Bulan Ini
        // Kita JOIN dengan claim_approvals untuk mendapatkan tanggal persetujuan HRD
        const [approvedClaimsResult] = await pool.query(
            `SELECT COUNT(DISTINCT mc.claim_id) AS total
             FROM medical_claims mc
             JOIN claim_approvals ca ON mc.claim_id = ca.claim_id
             WHERE mc.status IN ('DISETUJUI_HRD', 'DIBAYARKAN_KEUANGAN')
               AND ca.approval_role = 'HRD' AND ca.status = 'APPROVED'
               AND MONTH(ca.approval_date) = ? AND YEAR(ca.approval_date) = ?;`,
            [currentMonth, currentYear]
        );
        const approvedClaims = approvedClaimsResult[0].total;

        // PERBAIKAN DI SINI: Total Biaya Klaim Bulan Ini
        // Kita JOIN dengan claim_approvals untuk mendapatkan tanggal pembayaran oleh KEUANGAN
        // Note: Asumsi `reimbursed_amount` ada di tabel `medical_claims` sesuai controller Anda yang lain
        const [totalClaimCostResult] = await pool.query(
            `SELECT SUM(mc.claim_amount) AS total_cost 
             FROM medical_claims mc
             JOIN claim_approvals ca ON mc.claim_id = ca.claim_id
             WHERE mc.status = 'DIBAYARKAN_KEUANGAN'
               AND ca.approval_role = 'KEUANGAN' AND ca.status = 'APPROVED'
               AND MONTH(ca.approval_date) = ? AND YEAR(ca.approval_date) = ?;`,
            [currentMonth, currentYear]
        );
        const totalClaimCost = totalClaimCostResult[0].total_cost || 0;

        // Karyawan terbaru - Query ini sudah benar
        const [recentEmployeesResult] = await pool.query(
            `SELECT employee_id, full_name, position FROM employees ORDER BY created_at DESC LIMIT 5;`
        );
        const recentEmployees = recentEmployeesResult.map(emp => ({
            name: emp.full_name,
            role: emp.position || 'N/A'
        }));

        res.status(200).json({
            summaryData: [
                { title: 'Total Karyawan', value: totalEmployees.toString() },
                { title: 'Klaim Masuk Bulan Ini', value: claimsInMonth.toString() },
                { title: 'Klaim Disetujui Bulan Ini', value: approvedClaims.toString() },
                { title: 'Total Biaya Klaim Bulan Ini', value: totalClaimCost }
            ],
            recentEmployees,
            recentClients: [] // Tetap kirim array kosong
        });

    } catch (error) {
        console.error('Error fetching HRD dashboard summary:', error);
        res.status(500).json({ message: 'Server error fetching dashboard summary.' });
    }
};

// --- Get Claims Per Month for Bar Chart ---
exports.getClaimsPerMonth = async (req, res) => {
    try {
        const year = req.query.year || getCurrentYear(); // Ambil tahun dari query param, default tahun ini
        const [claimsData] = await pool.query(
            `SELECT
                DATE_FORMAT(claim_date, '%b') AS month,
                MONTH(claim_date) AS month_num,
                COUNT(*) AS total_claims
             FROM medical_claims
             WHERE YEAR(claim_date) = ?
             GROUP BY month, month_num
             ORDER BY month_num;`,
            [year]
        );

        // Map data agar sesuai format Recharts (bulan Jan-Des)
        const fullYearData = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(year, i, 1);
            return {
                bulan: date.toLocaleString('en-US', { month: 'short' }), // Jan, Feb, Mar...
                jumlah: 0
            };
        });

        claimsData.forEach(item => {
            const index = item.month_num - 1;
            if (fullYearData[index]) {
                fullYearData[index].jumlah = item.total_claims;
            }
        });

        res.status(200).json(fullYearData);
    } catch (error) {
        console.error('Error fetching claims per month:', error);
        res.status(500).json({ message: 'Server error fetching claims per month.' });
    }
};

// --- Get Claims Status for Pie Chart ---
exports.getClaimsStatus = async (req, res) => {
    try {
        const [statusData] = await pool.query(
            `SELECT status, COUNT(*) AS total FROM medical_claims GROUP BY status;`
        );

        // Map data agar sesuai format Recharts
        const formattedData = statusData.map(item => ({
            name: item.status.replace(/_/g, ' '), // Ganti underscore dengan spasi
            value: item.total
        }));

        // Tambahkan status yang mungkin tidak ada di DB tapi ingin ditampilkan
        const allPossibleStatus = ['PENGAJUAN', 'DISETUJUI_HRD', 'DITOLAK_HRD', 'DIBAYARKAN_KEUANGAN'];
        const finalData = allPossibleStatus.map(status => {
            const found = formattedData.find(item => item.name.toUpperCase().replace(/ /g, '_') === status);
            return {
                name: status.replace(/_/g, ' '),
                value: found ? found.value : 0
            };
        });

        res.status(200).json(finalData);
    } catch (error) {
        console.error('Error fetching claims status:', error);
        res.status(500).json({ message: 'Server error fetching claims status.' });
    }
};

// --- FUNGSI BARU UNTUK DASHBOARD KARYAWAN ---
exports.getKaryawanDashboardSummary = async (req, res) => {
    const { employee_id } = req.user; // Ambil employee_id dari token
    const currentYear = new Date().getFullYear();

    try {
        // 1. Dapatkan Sisa Plafon
        const [limitData] = await pool.query(
            'SELECT (max_claim_amount - used_amount) AS remaining_limit FROM claim_limits WHERE employee_id = ? AND year = ?',
            [employee_id, currentYear]
        );
        const remainingLimit = limitData.length > 0 ? limitData[0].remaining_limit : 0;

        // 2. Dapatkan Total Klaim Diajukan
        const [totalClaimsData] = await pool.query('SELECT COUNT(*) AS total FROM medical_claims WHERE employee_id = ?', [employee_id]);
        const totalClaims = totalClaimsData[0].total;

        // 3. Dapatkan Total Dana yang Sudah Dibayarkan
        const [reimbursedData] = await pool.query(
            "SELECT SUM(claim_amount) AS total FROM medical_claims WHERE employee_id = ? AND status = 'DIBAYARKAN_KEUANGAN'",
            [employee_id]
        );
        const totalReimbursed = reimbursedData[0].total || 0;

        // 4. Dapatkan 5 Klaim Terbaru
        const [recentClaims] = await pool.query(
            'SELECT claim_id, claim_date, status FROM medical_claims WHERE employee_id = ? ORDER BY claim_date DESC LIMIT 5',
            [employee_id]
        );
        
        // 5. Data untuk Pie Chart (Status Klaim)
        const [pieChartData] = await pool.query(
            'SELECT status, COUNT(*) AS value FROM medical_claims WHERE employee_id = ? GROUP BY status',
            [employee_id]
        );

        // 6. Data untuk Bar Chart (Klaim per Bulan)
        const [barChartData] = await pool.query(
            `SELECT DATE_FORMAT(claim_date, '%b') AS bulan, COUNT(*) AS jumlah 
             FROM medical_claims WHERE employee_id = ? AND YEAR(claim_date) = ? 
             GROUP BY DATE_FORMAT(claim_date, '%b'), MONTH(claim_date) 
             ORDER BY MONTH(claim_date)`,
            [employee_id, currentYear]
        );

        res.status(200).json({
            summaryData: {
                remainingLimit,
                totalClaims,
                totalReimbursed
            },
            recentClaims,
            pieChartData: pieChartData.map(d => ({ ...d, name: d.status.replace(/_/g, ' ') })),
            barChartData
        });

    } catch (error) {
        console.error('Error fetching employee dashboard summary:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data.' });
    }
};

exports.getKaryawanClaimsPerMonth = async (req, res) => {
    const { employee_id } = req.user;
    const currentYear = new Date().getFullYear();

    try {
        // 1. Ambil data klaim yang ada di database
        const [claimsData] = await pool.query(
            `SELECT MONTH(claim_date) AS month_num, COUNT(*) AS jumlah 
             FROM medical_claims WHERE employee_id = ? AND YEAR(claim_date) = ? 
             GROUP BY MONTH(claim_date) 
             ORDER BY MONTH(claim_date)`,
            [employee_id, currentYear]
        );

        // 2. Buat array dasar untuk 12 bulan (Jan-Des)
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const fullYearData = months.map(monthName => ({
            bulan: monthName,
            jumlah: 0
        }));

        // 3. Gabungkan data dari database ke dalam array 12 bulan
        claimsData.forEach(item => {
            const index = item.month_num - 1; // month_num (1-12) menjadi index array (0-11)
            if (fullYearData[index]) {
                fullYearData[index].jumlah = item.jumlah;
            }
        });

        res.status(200).json(fullYearData);
    } catch (error) {
        console.error('Error fetching employee claims per month:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getKaryawanClaimsStatus = async (req, res) => {
    const { employee_id } = req.user;
    try {
        const [pieChartData] = await pool.query(
            'SELECT status, COUNT(*) AS value FROM medical_claims WHERE employee_id = ? GROUP BY status',
            [employee_id]
        );
        // Format nama agar lebih rapi di frontend
        const formattedData = pieChartData.map(d => ({ ...d, name: d.status.replace(/_/g, ' ') }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// --- FUNGSI BARU UNTUK DASHBOARD KEUANGAN ---
exports.getKeuanganDashboardSummary = async (req, res) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    try {
        // 1. Summary Cards Data
        const [pending] = await pool.query("SELECT COUNT(*) as total FROM medical_claims WHERE status = 'DISETUJUI_HRD'");
        const [paidThisMonth] = await pool.query(
            `SELECT SUM(claim_amount) as total FROM medical_claims 
             WHERE status = 'DIBAYARKAN_KEUANGAN' AND MONTH(updated_at) = ? AND YEAR(updated_at) = ?`,
            [currentMonth, currentYear]
        );
        const [totalPaid] = await pool.query("SELECT SUM(claim_amount) as total FROM medical_claims WHERE status = 'DIBAYARKAN_KEUANGAN'");

        // 2. Pie Chart Data
        const [pieChartData] = await pool.query(
            `SELECT status, COUNT(*) as value FROM medical_claims 
             WHERE status IN ('DISETUJUI_HRD', 'DIBAYARKAN_KEUANGAN') GROUP BY status`
        );

        // 3. Bar Chart Data
        const [barChartData] = await pool.query(
            `SELECT DATE_FORMAT(updated_at, '%b') AS bulan, SUM(claim_amount) AS jumlah 
             FROM medical_claims WHERE status = 'DIBAYARKAN_KEUANGAN' AND YEAR(updated_at) = ?
             GROUP BY DATE_FORMAT(updated_at, '%b'), MONTH(updated_at) ORDER BY MONTH(updated_at)`,
            [currentYear]
        );

        // 4. Latest Claims Table
        const [latestClaims] = await pool.query(
            `SELECT mc.claim_id, e.full_name AS nama, mc.claim_amount AS nominal, mc.status, mc.claim_date AS tanggal 
             FROM medical_claims mc JOIN employees e ON mc.employee_id = e.employee_id
             ORDER BY mc.created_at DESC LIMIT 5`
        );
        
        res.status(200).json({
            summaryData: {
                pendingPayments: pending[0].total,
                totalPaidThisMonth: paidThisMonth[0].total || 0,
                totalPaidAllTime: totalPaid[0].total || 0,
            },
            pieChartData,
            barChartData,
            latestClaims
        });
    } catch (error) {
        console.error("Error fetching finance dashboard:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};