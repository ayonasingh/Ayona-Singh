const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, default: '' },
    genre: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    coverImage: { type: String, default: '' },
    review: { type: String, default: '' },        // Full review / my thoughts
    excerpt: { type: String, default: '' },        // Short blurb for cards
    downloadLink: { type: String, default: '' },   // Direct PDF or Drive link
    publishedYear: { type: String, default: '' },
    readDate: { type: String, default: '' },
    pageCount: { type: String, default: '' },
    language: { type: String, default: 'English' },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
