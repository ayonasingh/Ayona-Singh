import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/api';
import {
    BiSearch, BiCalendar, BiTime, BiRightArrowAlt,
    BiFilterAlt, BiBookOpen, BiChevronRight
} from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';
import './BlogsPageNew.css';

const FALLBACK_IMGS = [Img1, Img2, Img3, AyonaAbout, Img1, Img2];
const FALLBACK_BLOGS = [
    { id: 1, tag: 'Calculus', date: 'Feb 10, 2026', readTime: '5 min read', title: 'Understanding Limits & Continuity in Real Analysis', excerpt: 'Limits are the backbone of calculus. In this post I break down what limits really mean, how to evaluate them, and why continuity matters so much in analysis.' },
    { id: 2, tag: 'Statistics', date: 'Jan 28, 2026', readTime: '6 min read', title: 'Demystifying Probability Distributions for Beginners', excerpt: "From Binomial to Normal — understanding probability distributions can feel overwhelming. Here's a simple, visual guide to the most common ones used in statistics." },
    { id: 3, tag: 'Linear Algebra', date: 'Jan 15, 2026', readTime: '7 min read', title: 'Eigenvalues, Eigenvectors & Why They Matter', excerpt: "Eigenvalues are everywhere — from Google's PageRank to quantum mechanics. Let's explore their real-world applications." },
    { id: 4, tag: 'Problem Solving', date: 'Jan 5, 2026', readTime: '4 min read', title: 'My Top 5 Strategies for Cracking Math Olympiad Problems', excerpt: "After competing in school-level Math Olympiads, I've picked up proven problem-solving strategies. Here are the five that helped me the most." },
    { id: 5, tag: 'Python & Math', date: 'Dec 22, 2025', readTime: '8 min read', title: 'How to Visualize Mathematical Functions with Python', excerpt: 'Matplotlib and NumPy make it incredibly easy to plot functions and data. Walk through creating beautiful math visualizations step by step.' },
    { id: 6, tag: 'Study Tips', date: 'Dec 10, 2025', readTime: '3 min read', title: 'How I Stay Consistent With My Math Studies Every Day', excerpt: "Consistency beats intensity. Here's my personal routine that keeps me sharp and motivated as a math student." },
];

const TAG_COLORS = {
    'Calculus': '#7c6ff7',
    'Statistics': '#0ea5e9',
    'Linear Algebra': '#10b981',
    'Problem Solving': '#f59e0b',
    'Python & Math': '#3b82f6',
    'Study Tips': '#ec4899',
    'Default': '#8b5cf6',
};

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('All');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/blogs`)
            .then(res => setBlogs(res.data?.length ? res.data : FALLBACK_BLOGS))
            .catch(() => setBlogs(FALLBACK_BLOGS))
            .finally(() => setLoading(false));
    }, []);

    const getImage = (blog, index) => blog.image || FALLBACK_IMGS[index % FALLBACK_IMGS.length];
    const tags = ['All', ...Array.from(new Set(blogs.map(b => b.tag).filter(Boolean)))];
    const filtered = blogs.filter(b => {
        const matchSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.excerpt?.toLowerCase().includes(search.toLowerCase());
        const matchTag = activeTag === 'All' || b.tag === activeTag;
        return matchSearch && matchTag;
    });

    const getTagColor = tag => TAG_COLORS[tag] || TAG_COLORS['Default'];

    return (
        <div className="blp-wrapper">
            {/* ── Hero ── */}
            <section className="blp-hero">
                <div className="blp-hero__orb blp-hero__orb--1" />
                <div className="blp-hero__orb blp-hero__orb--2" />
                <div className="blp-hero__orb blp-hero__orb--3" />
                <div className="blp-hero__content">
                    <nav className="blp-breadcrumb">
                        <Link to="/">Home</Link>
                        <BiChevronRight />
                        <span>Blogs</span>
                    </nav>
                    <div className="blp-hero__tag-line">
                        <span className="blp-hero__dot" />
                        My Writing
                    </div>
                    <h1 className="blp-hero__title">Thoughts & <span>Insights</span></h1>
                    <p className="blp-hero__sub">Explorations in Mathematics, Data Science, and the art of learning — written for curious minds.</p>
                    <div className="blp-hero__stats">
                        <div className="blp-hero__stat"><strong>{blogs.length}</strong><span>Articles</span></div>
                        <div className="blp-hero__stat-div" />
                        <div className="blp-hero__stat"><strong>{tags.length - 1}</strong><span>Topics</span></div>
                        <div className="blp-hero__stat-div" />
                        <div className="blp-hero__stat"><strong>∞</strong><span>Ideas</span></div>
                    </div>
                </div>
                <div className="blp-hero__math-float">
                    <span>∑</span><span>∫</span><span>π</span><span>dx</span><span>∞</span>
                </div>
            </section>

            {/* ── Filter Bar ── */}
            <div className="blp-filters">
                <div className="blp-filters__inner">
                    <div className="blp-search">
                        <BiSearch className="blp-search__icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search articles…"
                            className="blp-search__input"
                        />
                        {search && (
                            <button className="blp-search__clear" onClick={() => setSearch('')}>×</button>
                        )}
                    </div>
                    <div className="blp-tags">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                className={`blp-tag${activeTag === tag ? ' blp-tag--active' : ''}`}
                                style={activeTag === tag && tag !== 'All' ? { '--tag-c': getTagColor(tag) } : {}}
                                onClick={() => setActiveTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="blp-body">
                {loading ? (
                    <div className="blp-loading">
                        <div className="blp-spinner" />
                        <p>Loading articles…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="blp-empty">
                        <BiBookOpen />
                        <p>No articles found matching your search.</p>
                        <button onClick={() => { setSearch(''); setActiveTag('All'); }}>Clear filters</button>
                    </div>
                ) : (
                    <div className="blp-grid">
                        {filtered.map((blog, i) => {
                            const id = blog._id || blog.id;
                            const tagColor = getTagColor(blog.tag);
                            return (
                                <article
                                    className={`blp-card${i === 0 && activeTag === 'All' && !search ? ' blp-card--featured' : ''}`}
                                    key={id}
                                    style={{ '--card-clr': tagColor, animationDelay: `${i * 60}ms` }}
                                >
                                    <Link to={`/blogs/${id}`} className="blp-card__img-wrap">
                                        <img src={getImage(blog, i)} alt={blog.title} className="blp-card__img" />
                                        <div className="blp-card__img-overlay" />
                                        <span className="blp-card__tag" style={{ background: tagColor }}>{blog.tag}</span>
                                        {i === 0 && activeTag === 'All' && !search && (
                                            <span className="blp-card__featured-badge">✦ Featured</span>
                                        )}
                                    </Link>
                                    <div className="blp-card__body">
                                        <div className="blp-card__meta">
                                            <span className="blp-card__date"><BiCalendar />{blog.date}</span>
                                            <span className="blp-card__read"><BiTime />{blog.readTime}</span>
                                        </div>
                                        <h2 className="blp-card__title">
                                            <Link to={`/blogs/${id}`}>{blog.title}</Link>
                                        </h2>
                                        <p className="blp-card__excerpt">{blog.excerpt}</p>
                                        <div className="blp-card__footer">
                                            <Link to={`/blogs/${id}`} className="blp-card__cta">
                                                Read Article <BiRightArrowAlt />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="blp-card__glow" />
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;
