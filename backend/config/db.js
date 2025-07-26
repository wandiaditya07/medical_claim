// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({ // Ubah nama variabel dari 'db' menjadi 'pool'
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, // Pastikan ini DB_PASS atau DB_PASSWORD sesuai .env
    database: process.env.DB_NAME,
    waitForConnections: true, // Tambahkan ini agar pool menunggu koneksi
    connectionLimit: 10,      // Batasi jumlah koneksi
    queueLimit: 0             // Tanpa batas antrian
});

// Tambahkan fungsi untuk menguji koneksi database
async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        connection.release(); // Lepaskan koneksi kembali ke pool
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Penting: Keluar dari aplikasi jika koneksi DB gagal saat startup
        process.exit(1);
    }
}

// Export pool dan testDbConnection
module.exports = { pool, testDbConnection };