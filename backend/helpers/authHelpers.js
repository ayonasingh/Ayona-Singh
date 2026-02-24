const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ayona_admin_secret_2026';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authenticate socket connection
const authenticateSocket = (token) => {
    return verifyToken(token);
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateSocket
};
