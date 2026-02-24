const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

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
