require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
        credentials: true
    }
});

global.io = io;

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ayona_admin_secret_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';

// ===== Middleware =====
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Ensure directories exist =====
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ===== DB: MongoDB Models =====
let SiteContent, Blog, Contact;
let useDB = false;

// ===== Fallback: JSON helpers =====
const readJSON = (file) => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
const writeJSON = (file, data) => {
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
};

// ===== MongoDB connect =====
const connectDB = async () => {
    if (!MONGO_URI) {
        console.log('⚠️  MONGO_URI not set – using JSON file storage');
        return;
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');

        // Load models after connection
        SiteContent = require('./models/SiteContent');
        Blog = require('./models/Blog');
        Contact = require('./models/Contact');
        useDB = true;

        await seedDefaults();
    } catch (err) {
        console.error('❌ MongoDB error:', err.message);
        console.log('⚠️  Falling back to JSON file storage');
    }
};

const DEFAULT_SECTIONS = {
    home: {
        name: 'Ayona Singh',
        subtitle: 'Mathematics Student',
        description: 'Passionate mathematics student with strong analytical skills, problem-solving abilities, and a deep love for numbers, statistics, and mathematical modeling.'
    },
    about: {
        description: 'I am Ayona Singh, a passionate Mathematics student with a strong foundation in calculus, statistics, linear algebra, and mathematical modeling.',
        image: '',
        stats: [
            { id: 'achievements', icon: 'BiAward', title: 'Achievements', subtitle: 'Academic Excellence' },
            { id: 'courses', icon: 'BiBookOpen', title: 'Courses', subtitle: '15+ Completed' },
            { id: 'projects', icon: 'BiCalculator', title: 'Projects', subtitle: '10 + Math Projects' }
        ]
    },
    qualification: {
        education: [
            { id: 'e1', title: 'B.Sc. (Hons.) Mathematics', institution: 'Miranda House, University of Delhi', period: '2022 – Present' },
            { id: 'e2', title: 'Higher Secondary Certificate (PCM)', institution: 'Delhi Public School, R.K. Puram', period: '2020 – 2022' },
            { id: 'e3', title: 'Secondary School Certificate', institution: 'Delhi Public School, R.K. Puram', period: '2018 – 2020' },
            { id: 'e4', title: 'Mathematics Olympiad (Regional Finalist)', institution: 'Homi Bhabha Centre for Science Education', period: '2021' }
        ],
        experience: [
            { id: 'w1', title: 'Mathematics Tutor', institution: 'Vedantu · Part-time (Remote)', period: 'Jan 2024 – Present' },
            { id: 'w2', title: 'Research Intern – Applied Mathematics', institution: 'IIT Delhi, Department of Mathematics', period: 'May 2023 – Aug 2023' },
            { id: 'w3', title: 'Data Analysis Intern', institution: 'Analytics Vidhya · Internship (Remote)', period: 'Dec 2022 – Mar 2023' },
            { id: 'w4', title: 'Student Teaching Assistant', institution: 'Miranda House, University of Delhi', period: 'Jul 2022 – Nov 2022' }
        ]
    },
    skills: {
        mathCore: [
            { id: 's1', name: 'Calculus', level: 'Advanced' },
            { id: 's2', name: 'Linear Algebra', level: 'Advanced' },
            { id: 's3', name: 'Statistics', level: 'Intermediate' },
            { id: 's4', name: 'Number Theory', level: 'Intermediate' },
            { id: 's5', name: 'Differential Equations', level: 'Intermediate' },
            { id: 's6', name: 'Real Analysis', level: 'Basic' }
        ],
        tools: [
            { id: 't1', name: 'Python', level: 'Intermediate' },
            { id: 't2', name: 'MATLAB', level: 'Basic' },
            { id: 't3', name: 'LaTeX', level: 'Intermediate' },
            { id: 't4', name: 'MS Excel', level: 'Advanced' },
            { id: 't5', name: 'Data Analysis', level: 'Intermediate' }
        ]
    }
};

const seedDefaults = async () => {
    for (const [section, data] of Object.entries(DEFAULT_SECTIONS)) {
        const exists = await SiteContent.findOne({ section });
        if (!exists) {
            await SiteContent.create({ section, data });
            console.log(`  📦 Seeded default "${section}" data into MongoDB`);
        }
    }
};

// ===== DB helpers (MongoDB or JSON fallback) =====
const getSection = async (section) => {
    if (useDB) {
        const doc = await SiteContent.findOne({ section });
        return doc ? doc.data : DEFAULT_SECTIONS[section] || {};
    }
    const json = readJSON('siteContent.json');
    return json[section] || {};
};

const setSection = async (section, data) => {
    if (useDB) {
        const doc = await SiteContent.findOneAndUpdate(
            { section },
            { data },
            { upsert: true, new: true }
        );
        return doc.data;
    }
    const json = readJSON('siteContent.json');
    json[section] = { ...json[section], ...data };
    writeJSON('siteContent.json', json);
    return json[section];
};

// ===== Multer =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype))
            cb(null, true);
        else cb(new Error('Only images are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

// ===== Auth Middleware =====
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ============================
// AUTH ROUTES
// ============================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/auth/verify', authenticate, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// ============================
// IMAGE UPLOAD ROUTE
// ============================
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
});

// ============================
// HOME ROUTES
// ============================
app.get('/api/home', async (req, res) => {
    try { res.json(await getSection('home')); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/home', authenticate, async (req, res) => {
    try {
        const data = await setSection('home', req.body);
        if (global.io) global.io.emit('content_updated', { section: 'home', data });
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// ABOUT ROUTES
// ============================
app.get('/api/about', async (req, res) => {
    try { res.json(await getSection('about')); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/about', authenticate, async (req, res) => {
    try {
        const data = await setSection('about', req.body);
        if (global.io) global.io.emit('content_updated', { section: 'about', data });
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// QUALIFICATION ROUTES
// ============================
app.get('/api/qualification', async (req, res) => {
    try { res.json(await getSection('qualification')); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/qualification', authenticate, async (req, res) => {
    try {
        const data = await setSection('qualification', req.body);
        if (global.io) global.io.emit('content_updated', { section: 'qualification', data });
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// SKILLS ROUTES
// ============================
app.get('/api/skills', async (req, res) => {
    try { res.json(await getSection('skills')); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/skills', authenticate, async (req, res) => {
    try {
        const data = await setSection('skills', req.body);
        if (global.io) global.io.emit('content_updated', { section: 'skills', data });
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// BLOGS ROUTES (MongoDB / JSON)
// ============================
app.get('/api/blogs', async (req, res) => {
    try {
        if (useDB) return res.json(await Blog.find().sort({ createdAt: -1 }));
        res.json(readJSON('blogs.json'));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {
        if (useDB) {
            const blog = await Blog.findById(req.params.id);
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            return res.json(blog);
        }
        const blogs = readJSON('blogs.json');
        const blog = blogs.find((b) => b.id === req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/blogs', authenticate, async (req, res) => {
    try {
        if (useDB) {
            const blog = await Blog.create(req.body);
            const all = await Blog.find().sort({ createdAt: -1 });
            if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'create', data: blog, allBlogs: all });
            return res.status(201).json(blog);
        }
        const blogs = readJSON('blogs.json');
        const newBlog = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
        blogs.unshift(newBlog);
        writeJSON('blogs.json', blogs);
        if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'create', data: newBlog, allBlogs: blogs });
        res.status(201).json(newBlog);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/blogs/:id', authenticate, async (req, res) => {
    try {
        if (useDB) {
            const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            const all = await Blog.find().sort({ createdAt: -1 });
            if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'update', data: blog, allBlogs: all });
            return res.json(blog);
        }
        const blogs = readJSON('blogs.json');
        const index = blogs.findIndex((b) => b.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Blog not found' });
        blogs[index] = { ...blogs[index], ...req.body };
        writeJSON('blogs.json', blogs);
        if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'update', data: blogs[index], allBlogs: blogs });
        res.json(blogs[index]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/blogs/:id', authenticate, async (req, res) => {
    try {
        if (useDB) {
            const blog = await Blog.findByIdAndDelete(req.params.id);
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            if (blog.image && blog.image.includes('/uploads/')) {
                const fn = blog.image.split('/uploads/')[1];
                const fp = path.join(uploadsDir, fn);
                if (fs.existsSync(fp)) fs.unlinkSync(fp);
            }
            const all = await Blog.find().sort({ createdAt: -1 });
            if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'delete', data: { id: req.params.id }, allBlogs: all });
            return res.json({ message: 'Blog deleted' });
        }
        let blogs = readJSON('blogs.json');
        const blog = blogs.find((b) => b.id === req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        if (blog.image && blog.image.includes('/uploads/')) {
            const fn = blog.image.split('/uploads/')[1];
            const fp = path.join(uploadsDir, fn);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        blogs = blogs.filter((b) => b.id !== req.params.id);
        writeJSON('blogs.json', blogs);
        if (global.io) global.io.emit('content_updated', { section: 'blogs', action: 'delete', data: { id: req.params.id }, allBlogs: blogs });
        res.json({ message: 'Blog deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// CONTACTS ROUTES
// ============================
app.get('/api/contacts', authenticate, async (req, res) => {
    try {
        if (useDB) return res.json(await Contact.find().sort({ createdAt: -1 }));
        res.json(readJSON('contacts.json'));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/contacts', async (req, res) => {
    try {
        if (useDB) {
            const contact = await Contact.create(req.body);
            return res.status(201).json({ message: 'Message sent successfully', id: contact._id });
        }
        const contacts = readJSON('contacts.json');
        const newContact = { id: uuidv4(), ...req.body, read: false, createdAt: new Date().toISOString() };
        contacts.unshift(newContact);
        writeJSON('contacts.json', contacts);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/contacts/:id/read', authenticate, async (req, res) => {
    try {
        if (useDB) {
            const c = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
            if (!c) return res.status(404).json({ error: 'Not found' });
            return res.json(c);
        }
        const contacts = readJSON('contacts.json');
        const idx = contacts.findIndex((c) => c.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        contacts[idx].read = true;
        writeJSON('contacts.json', contacts);
        res.json(contacts[idx]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/contacts/:id', authenticate, async (req, res) => {
    try {
        if (useDB) {
            await Contact.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Deleted' });
        }
        let contacts = readJSON('contacts.json');
        contacts = contacts.filter((c) => c.id !== req.params.id);
        writeJSON('contacts.json', contacts);
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// STATS ROUTE
// ============================
app.get('/api/stats', authenticate, async (req, res) => {
    try {
        let blogsCount, messagesCount, unreadMessages;
        if (useDB) {
            blogsCount = await Blog.countDocuments();
            messagesCount = await Contact.countDocuments();
            unreadMessages = await Contact.countDocuments({ read: false });
        } else {
            const blogs = readJSON('blogs.json');
            const contacts = readJSON('contacts.json');
            blogsCount = blogs.length;
            messagesCount = contacts.length;
            unreadMessages = contacts.filter((c) => !c.read).length;
        }
        res.json({ blogsCount, messagesCount, unreadMessages, dbConnected: useDB });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// GET ALL CONTENT
// ============================
app.get('/api/content/all', authenticate, async (req, res) => {
    try {
        const [home, about, qualification, skills] = await Promise.all([
            getSection('home'),
            getSection('about'),
            getSection('qualification'),
            getSection('skills'),
        ]);
        let blogs, contacts;
        if (useDB) {
            blogs = await Blog.find().sort({ createdAt: -1 });
            contacts = await Contact.find().sort({ createdAt: -1 });
        } else {
            blogs = readJSON('blogs.json');
            contacts = readJSON('contacts.json');
        }
        res.json({ home, about, qualification, skills, blogs, contacts });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================
// DB STATUS ROUTE
// ============================
app.get('/api/db-status', authenticate, (req, res) => {
    res.json({
        connected: useDB,
        type: useDB ? 'MongoDB' : 'JSON Files',
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// ============================
// CHAT SYSTEM ROUTES
// ============================
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/admin', adminRoutes);

// ============================
// Initialize Socket.IO
// ============================
const initializeSocket = require('./socket/chatSocket');
initializeSocket(io);

// ============================
// Start Server
// ============================
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`\n✅ Portfolio Backend running at http://localhost:${PORT}`);
        console.log(`🗄️  Database: ${useDB ? 'MongoDB Atlas' : 'JSON Files (fallback)'}`);
        console.log(`📁 Data dir: ${dataDir}`);
        console.log(`🖼️  Uploads: ${uploadsDir}`);
        console.log(`💬 Chat system: Socket.IO enabled`);
        console.log(`\n🔑 Admin Login: username=${ADMIN_USERNAME}  password=${ADMIN_PASSWORD}`);
        if (!MONGO_URI) {
            console.log(`\n💡 To enable MongoDB, add MONGO_URI to your .env file`);
            console.log(`   Get a free DB at: https://mongodb.com/atlas`);
        }
    });
});
