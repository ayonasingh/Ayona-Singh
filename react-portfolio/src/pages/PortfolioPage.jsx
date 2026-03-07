import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/api';
import {
    BiChevronRight, BiLink, BiSearch, BiGridAlt, BiListUl,
    BiRightArrowAlt, BiCode, BiCalculator, BiAtom, BiStats,
} from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import './PortfolioPage.css';

const FALLBACK_IMGS = [Img1, Img2, Img3];

const FALLBACK_PROJECTS = [
    {
        id: 'f1', title: 'Statistical Analysis Project',
        description: 'Analyzed real-world datasets using descriptive and inferential statistics with Python and Excel. Applied hypothesis testing and regression models.',
        link: '#', category: 'Statistics',
    },
    {
        id: 'f2', title: 'Linear Algebra Research',
        description: 'Explored matrix transformations, eigenvalues, and their applications in real-world physics and computer graphics.',
        link: '#', category: 'Mathematics',
    },
    {
        id: 'f3', title: 'Calculus & Modeling',
        description: 'Built mathematical models using differential equations to simulate population and growth dynamics.',
        link: '#', category: 'Calculus',
    },
    {
        id: 'f4', title: 'Data Science with Python',
        description: 'End-to-end data pipeline including data cleaning, exploratory analysis, and machine learning classification.',
        link: '#', category: 'Data Science',
    },
    {
        id: 'f5', title: 'Number Theory Exploration',
        description: 'Deep dive into prime numbers, modular arithmetic, and cryptographic applications of number theory.',
        link: '#', category: 'Mathematics',
    },
    {
        id: 'f6', title: 'Probability & Stochastic Models',
        description: 'Constructed stochastic models to simulate random processes, Markov chains, and financial risk analysis.',
        link: '#', category: 'Statistics',
    },
];

const CATEGORY_CONFIG = {
    'Mathematics': { color: '#7c6ff7', icon: <BiCalculator /> },
    'Statistics': { color: '#0ea5e9', icon: <BiStats /> },
    'Data Science': { color: '#10b981', icon: <BiStats /> },
    'Calculus': { color: '#f59e0b', icon: <BiAtom /> },
    'Computer Science': { color: '#ec4899', icon: <BiCode /> },
    'Research': { color: '#8b5cf6', icon: <BiAtom /> },
    'Default': { color: '#6366f1', icon: <BiCode /> },
};

const getCategoryConfig = (cat) => CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Default'];

const PortfolioPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [hoveredId, setHoveredId] = useState(null);
    const heroRef = useRef(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/portfolio`)
            .then(r => setProjects(r.data?.length ? r.data : FALLBACK_PROJECTS))
            .catch(() => setProjects(FALLBACK_PROJECTS))
            .finally(() => setLoading(false));
    }, []);

    // Floating orb parallax on hero
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const onMove = (e) => {
            const { left, top, width, height } = hero.getBoundingClientRect();
            const x = ((e.clientX - left) / width - 0.5) * 30;
            const y = ((e.clientY - top) / height - 0.5) * 30;
            hero.querySelectorAll('.ptf-hero__orb').forEach((orb, i) => {
                const factor = (i + 1) * 0.4;
                orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        };
        hero.addEventListener('mousemove', onMove);
        return () => hero.removeEventListener('mousemove', onMove);
    }, []);

    const getImage = (p, i) => p.image || FALLBACK_IMGS[i % FALLBACK_IMGS.length];

    const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

    const filtered = projects.filter(p => {
        const ms = !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        const mc = activeCategory === 'All' || p.category === activeCategory;
        return ms && mc;
    });

    return (
        <div className="ptf-wrapper">
            {/* ── Hero ── */}
            <section className="ptf-hero" ref={heroRef}>
                <div className="ptf-hero__orb ptf-hero__orb--1" />
                <div className="ptf-hero__orb ptf-hero__orb--2" />
                <div className="ptf-hero__orb ptf-hero__orb--3" />
                <div className="ptf-hero__grid-bg" aria-hidden />

                <div className="ptf-hero__inner">
                    <nav className="ptf-breadcrumb">
                        <Link to="/">Home</Link>
                        <BiChevronRight />
                        <span>Portfolio</span>
                    </nav>

                    <div className="ptf-hero__badge">
                        <span className="ptf-hero__badge-dot" />
                        Academic Projects
                    </div>

                    <h1 className="ptf-hero__title">
                        My <span className="ptf-hero__title-accent">Portfolio</span>
                    </h1>

                    <p className="ptf-hero__sub">
                        A collection of academic projects, research work, and mathematical explorations
                        crafted with precision and curiosity.
                    </p>

                    <div className="ptf-hero__stats">
                        <div className="ptf-hero__stat">
                            <span className="ptf-hero__stat-num">{projects.length}+</span>
                            <span className="ptf-hero__stat-label">Projects</span>
                        </div>
                        <div className="ptf-hero__stat-sep" />
                        <div className="ptf-hero__stat">
                            <span className="ptf-hero__stat-num">{categories.length - 1}</span>
                            <span className="ptf-hero__stat-label">Categories</span>
                        </div>
                        <div className="ptf-hero__stat-sep" />
                        <div className="ptf-hero__stat">
                            <span className="ptf-hero__stat-num">3+</span>
                            <span className="ptf-hero__stat-label">Years</span>
                        </div>
                    </div>
                </div>

                {/* Floating math symbols */}
                <div className="ptf-hero__symbols" aria-hidden>
                    {['∑', 'π', '∞', '√', '∫', 'Δ', 'λ', 'φ'].map((s, i) => (
                        <span key={i} className="ptf-hero__sym" style={{ '--delay': `${i * 0.7}s`, '--x': `${10 + i * 11}%` }}>{s}</span>
                    ))}
                </div>
            </section>

            {/* ── Toolbar ── */}
            <div className="ptf-toolbar">
                <div className="ptf-toolbar__inner">
                    <div className="ptf-search">
                        <BiSearch className="ptf-search__icon" />
                        <input
                            id="ptf-search-input"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search projects…"
                            className="ptf-search__input"
                        />
                        {search && <button className="ptf-search__clear" onClick={() => setSearch('')}>×</button>}
                    </div>

                    <div className="ptf-cats">
                        {categories.map(cat => {
                            const cfg = getCategoryConfig(cat);
                            return (
                                <button
                                    key={cat}
                                    id={`ptf-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                                    className={`ptf-cat-btn${activeCategory === cat ? ' active' : ''}`}
                                    style={activeCategory === cat && cat !== 'All' ? { '--cc': cfg.color } : {}}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    <div className="ptf-view-toggle">
                        <button
                            id="ptf-view-grid"
                            className={`ptf-vt${viewMode === 'grid' ? ' ptf-vt--active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <BiGridAlt />
                        </button>
                        <button
                            id="ptf-view-list"
                            className={`ptf-vt${viewMode === 'list' ? ' ptf-vt--active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <BiListUl />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="ptf-body">
                <div className="ptf-results-info">
                    <span>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'} found</span>
                </div>

                {loading ? (
                    <div className="ptf-loading">
                        <div className="ptf-spinner" />
                        <p>Loading projects…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ptf-empty">
                        <span>🔭</span>
                        <p>No projects found.</p>
                        <button onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="ptf-grid">
                        {filtered.map((proj, idx) => {
                            const id = proj._id || proj.id;
                            const cfg = getCategoryConfig(proj.category);
                            const isHovered = hoveredId === id;
                            return (
                                <article
                                    className="ptf-card"
                                    key={id}
                                    style={{ '--cc': cfg.color, animationDelay: `${idx * 70}ms` }}
                                    onMouseEnter={() => setHoveredId(id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div className="ptf-card__img-wrap">
                                        <img
                                            src={getImage(proj, idx)}
                                            alt={proj.title}
                                            className="ptf-card__img"
                                        />
                                        <div className="ptf-card__img-overlay">
                                            {proj.link && proj.link !== '#' && (
                                                <a
                                                    href={proj.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="ptf-card__overlay-btn"
                                                >
                                                    <BiLink /> View Demo
                                                </a>
                                            )}
                                        </div>
                                        <div className="ptf-card__number">{String(idx + 1).padStart(2, '0')}</div>
                                    </div>

                                    <div className="ptf-card__body">
                                        {proj.category && (
                                            <span
                                                className="ptf-card__cat"
                                                style={{ background: cfg.color + '18', color: cfg.color }}
                                            >
                                                {cfg.icon} {proj.category}
                                            </span>
                                        )}

                                        <h3 className="ptf-card__title">{proj.title}</h3>
                                        <p className="ptf-card__desc">{proj.description}</p>

                                        <div className="ptf-card__footer">
                                            {proj.link && proj.link !== '#' ? (
                                                <a
                                                    href={proj.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="ptf-card__cta"
                                                >
                                                    View Project <BiRightArrowAlt />
                                                </a>
                                            ) : (
                                                <span className="ptf-card__cta ptf-card__cta--muted">
                                                    Academic Project
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ptf-card__glow" style={{ '--cc': cfg.color }} />
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    // List view
                    <div className="ptf-list">
                        {filtered.map((proj, idx) => {
                            const id = proj._id || proj.id;
                            const cfg = getCategoryConfig(proj.category);
                            return (
                                <article className="ptf-list-item" key={id} style={{ '--cc': cfg.color, animationDelay: `${idx * 60}ms` }}>
                                    <div className="ptf-list-item__img-wrap">
                                        <img src={getImage(proj, idx)} alt={proj.title} className="ptf-list-item__img" />
                                    </div>
                                    <div className="ptf-list-item__info">
                                        {proj.category && (
                                            <span className="ptf-card__cat" style={{ background: cfg.color + '18', color: cfg.color }}>
                                                {cfg.icon} {proj.category}
                                            </span>
                                        )}
                                        <h3 className="ptf-list-item__title">{proj.title}</h3>
                                        <p className="ptf-list-item__desc">{proj.description}</p>
                                    </div>
                                    <div className="ptf-list-item__action">
                                        {proj.link && proj.link !== '#' ? (
                                            <a href={proj.link} target="_blank" rel="noreferrer" className="ptf-card__cta">
                                                View <BiRightArrowAlt />
                                            </a>
                                        ) : (
                                            <span className="ptf-card__cta ptf-card__cta--muted">Academic</span>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── CTA ── */}
            <section className="ptf-cta">
                <div className="ptf-cta__orb" />
                <h2 className="ptf-cta__title">Have a Project in Mind?</h2>
                <p className="ptf-cta__sub">I'm always open to collaborations, research partnerships, and interesting mathematical problems.</p>
                <Link to="/contact" className="ptf-cta__btn">
                    Get in Touch <BiRightArrowAlt />
                </Link>
            </section>
        </div>
    );
};

export default PortfolioPage;
