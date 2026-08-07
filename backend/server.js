const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bugs', require('./routes/bugRoutes'));
app.use('/api/autofix', require('./autofix-ai/autofixRoutes'));

// Express v5 fallback for SPA or missing routes
app.use((req, res, next) => {
    // If it's an API route that wasn't found, next() to 404 handler
    if (req.path.startsWith('/api/')) {
        return next();
    }
    // Otherwise fallback to index.html for frontend routing if needed
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
