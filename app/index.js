const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect('mongodb://localhost:27017/coderone')
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);  // Exit process on failure
    });

// User Schema & Model
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});
const User = mongoose.model('User', UserSchema);

// ✅ User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ User Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get User Info
app.get('/api/user', async (req, res) => {
    try {
        const user = await User.findOne({}, 'username email'); // Fetch username & email only
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user information' });
    }
});

// ✅ Update User Info
app.put('/api/user', async (req, res) => {
    const { username, email } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            {},
            { username, email },
            { new: true }  // Return updated document
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user information' });
    }
});

// ✅ Logout (Dummy Endpoint)
app.post('/api/logout', (req, res) => {
    res.sendStatus(200);
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
