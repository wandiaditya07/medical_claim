const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims');
const { testDbConnection } = require('./config/db');

dotenv.config();
const app = express();
testDbConnection();

// Middleware
app.use(cors()); // Enable CORS for all routes (adjust as needed for security)
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.send('Welcome to the Employee Health Claim API!');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(process.env.PORT, () => {
  console.log(`JWT Auth server running on port ${process.env.PORT}`);
});

