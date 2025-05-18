const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10 minutes session expiry
}));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("users", UserSchema);

// Routes
app.get('/', (req, res) => {
    res.redirect('/register');
});

// Register Route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('<script>alert("Email already in use!"); window.location="/register";</script>');
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to DB
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send('<script>alert("User registered successfully!"); window.location="/login";</script>');
    } catch (error) {
        res.status(500).send('<script>alert("Server error!"); window.location="/register";</script>');
    }
});

// Login Route
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('<script>alert("User not found!"); window.location="/login";</script>');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('<script>alert("Invalid credentials!"); window.location="/login";</script>');
        }

        req.session.userId = user._id;
        res.redirect('/profile');
    } catch (error) {
        res.status(500).send('<script>alert("Server error!"); window.location="/login";</script>');
    }
});

// Profile Route
app.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', { user });
    } catch (error) {
        res.redirect('/login');
    }
});

// Update Profile Route
app.post('/updateProfile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        await User.findByIdAndUpdate(req.session.userId, {
            username: req.body.username,
            email: req.body.email
        });
        res.send('<script>alert("Profile updated successfully!"); window.location="/profile";</script>');
    } catch (error) {
        res.send('<script>alert("Error updating profile!"); window.location="/profile";</script>');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        res.redirect('/login');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
