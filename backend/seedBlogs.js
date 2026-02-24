/**
 * seedBlogs.js — Run once to insert the 12 demo blog posts into MongoDB
 * Usage: node seedBlogs.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env – aborting.');
    process.exit(1);
}

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    image: String,
    tag: String,
    date: String,
    readTime: String,
    link: String,
    tags: [String],
    published: { type: Boolean, default: true },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅  MongoDB connected');

        const existing = await Blog.countDocuments();
        if (existing >= 12) {
            console.log(`ℹ️   Already ${existing} blogs in DB — skipping seed.`);
            console.log('    Delete blogs from MongoDB Atlas and re-run if you want to reseed.');
            await mongoose.disconnect();
            return;
        }

        const filePath = path.join(__dirname, 'data', 'blogs.json');
        const blogs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        await Blog.deleteMany({});
        console.log('🗑️   Cleared existing blogs');

        const inserted = await Blog.insertMany(blogs.map(b => ({
            title: b.title,
            content: b.content || '',
            excerpt: b.excerpt || '',
            image: b.image || '',
            tag: b.tag || '',
            date: b.date || '',
            readTime: b.readTime || '',
            link: b.link || '#',
            published: true,
        })));

        console.log(`✅  Seeded ${inserted.length} blogs into MongoDB:`);
        inserted.forEach((b, i) => console.log(`   ${i + 1}. ${b.title}`));

        await mongoose.disconnect();
        console.log('\n✅  Done! Restart your backend server to see the new blogs.');
    } catch (err) {
        console.error('❌  Seed failed:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();
