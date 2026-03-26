require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not set in .env'); process.exit(1); }

const dataDir = path.join(__dirname, 'data');
const readJSON = (file) => {
    const p = path.join(dataDir, file);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
};

const SiteContent = require('./models/SiteContent');
const Blog = require('./models/Blog');
const Book = require('./models/Book');
const Contact = require('./models/Contact');

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── SiteContent ──────────────────────────────────────────
    const siteContent = readJSON('siteContent.json');
    for (const [section, data] of Object.entries(siteContent)) {
        await SiteContent.findOneAndUpdate({ section }, { data }, { upsert: true, new: true });
        console.log(`  📦 SiteContent: "${section}" seeded`);
    }

    // ── Blogs ────────────────────────────────────────────────
    const blogs = readJSON('blogs.json');
    await Blog.deleteMany({});
    if (blogs.length) {
        await Blog.insertMany(blogs.map(({ id, ...b }) => b));
        console.log(`  📝 Blogs: ${blogs.length} seeded`);
    }

    // ── Books ────────────────────────────────────────────────
    const books = readJSON('books.json');
    await Book.deleteMany({});
    if (books.length) {
        await Book.insertMany(books.map(({ id, ...b }) => b));
        console.log(`  📚 Books: ${books.length} seeded`);
    }

    // ── Contacts ─────────────────────────────────────────────
    const contacts = readJSON('contacts.json');
    await Contact.deleteMany({});
    if (contacts.length) {
        await Contact.insertMany(contacts.map(({ id, subject, ...c }) => c));
        console.log(`  📬 Contacts: ${contacts.length} seeded`);
    }

    console.log('\n✅ All data seeded to MongoDB successfully!');
    await mongoose.disconnect();
}

seed().catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1); });
