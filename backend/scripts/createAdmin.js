require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read existing users
let users = [];
if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

// Check if admin already exists
const existingAdmin = users.find(u => u.role === 'admin');
if (existingAdmin) {
    console.log('❌ Admin user already exists!');
    console.log('Admin ID:', existingAdmin.id);
    console.log('Username:', existingAdmin.username);
    console.log('Email:', existingAdmin.email);
    process.exit(1);
}

// Get admin credentials from environment or use defaults
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

// Hash password
const hashedPassword = bcrypt.hashSync(adminPassword, 10);

// Create admin user
const adminUser = {
    id: uuidv4(),
    username: adminUsername,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
};

// Add to users array
users.push(adminUser);

// Write to file
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

console.log('✅ Admin user created successfully!');
console.log('\n📋 Admin Details:');
console.log('ID:', adminUser.id);
console.log('Username:', adminUsername);
console.log('Email:', adminEmail);
console.log('Password:', adminPassword);
console.log('\n⚠️  Please change the default password after first login!');
console.log('\n🔑 You can now login with these credentials.');
