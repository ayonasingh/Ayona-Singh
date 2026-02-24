const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    id: String,
    icon: String,
    title: String,
    subtitle: String,
});

const qualEntrySchema = new mongoose.Schema({
    id: String,
    title: String,
    institution: String,
    period: String,
});

const siteContentSchema = new mongoose.Schema({
    section: { type: String, unique: true, required: true }, // 'home' | 'about' | 'qualification' | 'skills'
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
