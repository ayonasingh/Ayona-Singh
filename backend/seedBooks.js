// =====================================================
// seedBooks.js — Run with: node seedBooks.js
// Seeds books.json data into MongoDB Books collection
// =====================================================

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌  MONGO_URI not found in .env — aborting.');
    process.exit(1);
}

const Book = require('./models/Book');

const dataPath = path.join(__dirname, 'data', 'books.json');
const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seed = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected');

    // Wipe existing
    const deleted = await Book.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing book(s)`);

    const inserted = await Book.insertMany(
        books.map(({ id, _id, ...rest }) => rest)   // strip any JSON id fields
    );
    console.log(`📚  Seeded ${inserted.length} book(s) successfully!`);

    await mongoose.disconnect();
    console.log('👋  Done!');
};

seed().catch((err) => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
});
