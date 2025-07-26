// index.js (file utama)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims');
const userRoutes = require('./routes/users'); 
const reportRoutes = require('./routes/reports');
const employeeRoutes = require('./routes/employees');
const logRoutes = require('./routes/logs');
const karyawanRoutes = require('./routes/karyawan');
const dependentRoutes = require('./routes/dependents');
const keuanganRoutes = require('./routes/keuangan');
const searchRoutes = require('./routes/search');
const { testDbConnection } = require('./config/db'); 


const app = express();
const PORT = process.env.PORT || 4000;

// Test DB connection on startup
testDbConnection();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan URL frontend Anda
    credentials: true,
}));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/employees', employeeRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/karyawan', karyawanRoutes);
app.use('/api/dependents', dependentRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/search', searchRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.send('Welcome to the Employee Health Claim API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`JWT Auth server running on port ${PORT}`);
});