const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const {
    readUsers,
    writeUsers,
    findUserByEmail,
    findUserById,
    findUserByUsername,
    hashPassword,
    comparePassword
} = require('../helpers/userHelpers');
const { generateToken } = require('../helpers/authHelpers');
const { authenticate } = require('../middleware/auth');

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check for duplicates
        if (findUserByEmail(email)) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        if (findUserByUsername(username)) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        const users = readUsers();
        users.push(newUser);
        writeUsers(users);

        // Generate token
        const token = generateToken(newUser);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        users[userIndex].lastLogin = new Date().toISOString();
        writeUsers(users);

        // Generate token
        const token = generateToken(user);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// GET /api/users/profile
router.get('/profile', authenticate, (req, res) => {
    const user = findUserById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { username, email } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check for duplicates (excluding current user)
        if (email && email !== users[userIndex].email) {
            const existingEmail = findUserByEmail(email);
            if (existingEmail && existingEmail.id !== req.user.id) {
                return res.status(409).json({ error: 'Email already exists' });
            }
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            users[userIndex].email = email;
        }

        if (username && username !== users[userIndex].username) {
            const existingUsername = findUserByUsername(username);
            if (existingUsername && existingUsername.id !== req.user.id) {
                return res.status(409).json({ error: 'Username already exists' });
            }
            users[userIndex].username = username;
        }

        writeUsers(users);

        const { password, ...userWithoutPassword } = users[userIndex];
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Server error during profile update' });
    }
});

module.exports = router;
