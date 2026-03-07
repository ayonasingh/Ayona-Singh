const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const IS_VERCEL = process.env.VERCEL === '1';
const dataDir = IS_VERCEL ? '/tmp/data' : path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure dir exists (safe for Vercel /tmp)
try { if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true }); } catch(e) {}

// Read users from JSON
const readUsers = () => {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
};

// Write users to JSON
const writeUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Find user by email
const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Find user by ID
const findUserById = (id) => {
    const users = readUsers();
    return users.find(u => u.id === id);
};

// Find user by username
const findUserByUsername = (username) => {
    const users = readUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
};

// Hash password
const hashPassword = async (password) => {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    return await bcrypt.hash(password, rounds);
};

// Compare password
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    readUsers,
    writeUsers,
    findUserByEmail,
    findUserById,
    findUserByUsername,
    hashPassword,
    comparePassword
};
