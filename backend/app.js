require('dotenv').config();
const express = require('express');
const cors = require('cors'); // For handling CORS policy


const app = express();
const PORT = process.env.PORT || 4000;

// Test DB connection on startup








// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});