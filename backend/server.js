const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/bugs', require('./routes/bugRoutes'));
app.use('/api/autofix', require('./autofix-ai/autofixRoutes'));

// Simple Auth with bcrypt
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Seed default user
const seedUser = async () => {
    const existing = await User.findOne({ email: 'lpuna@gmail.com' });
    if (!existing) {
        await User.create({
            email: 'lpuna@gmail.com',
            password: bcrypt.hashSync('lpuna', 10)
        });
        console.log('Seeded default user: lpuna@gmail.com');
    }
};
seedUser();

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        await User.create({ email, password: bcrypt.hashSync(password, 10) });
        res.json({ success: true, message: 'Signed up successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            res.json({ success: true, message: 'Logged in successfully', email: user.email });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
