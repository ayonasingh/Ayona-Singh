const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');
        await seedDefaults();
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️  Falling back to JSON file storage...');
    }
};

// Seed default data if collections are empty
const seedDefaults = async () => {
    const sections = [
        {
            section: 'home',
            data: {
                name: 'Ayona Singh',
                subtitle: 'Mathematics Student',
                description: 'Passionate mathematics student with strong analytical skills, problem-solving abilities, and a deep love for numbers, statistics, and mathematical modeling.'
            }
        },
        {
            section: 'about',
            data: {
                description: 'I am Ayona Singh, a passionate Mathematics student with a strong foundation in calculus, statistics, linear algebra, and mathematical modeling. I love solving complex problems, analyzing data, and applying mathematical reasoning to real-world challenges.',
                image: '',
                stats: [
                    { id: 'achievements', icon: 'BiAward', title: 'Achievements', subtitle: 'Academic Excellence' },
                    { id: 'courses', icon: 'BiBookOpen', title: 'Courses', subtitle: '15+ Completed' },
                    { id: 'projects', icon: 'BiCalculator', title: 'Projects', subtitle: '10 + Math Projects' }
                ]
            }
        },
        {
            section: 'qualification',
            data: {
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
            }
        },
        {
            section: 'skills',
            data: {
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
        }
    ];

    for (const item of sections) {
        const exists = await SiteContent.findOne({ section: item.section });
        if (!exists) {
            await SiteContent.create(item);
            console.log(`  📦 Seeded default ${item.section} data`);
        }
    }
};

module.exports = connectDB;
