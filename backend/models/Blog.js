const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: [String],
    published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
