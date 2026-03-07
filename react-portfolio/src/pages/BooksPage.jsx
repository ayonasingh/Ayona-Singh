import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/api';
import { BiSearch, BiBookOpen, BiDownload, BiChevronRight, BiStar } from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import './BooksPageNew.css';

const FALLBACK_COVERS = [Img1, Img2, Img3];
const GENRE_COLORS = {
    'Mathematics': '#7c6ff7', 'Statistics': '#0ea5e9', 'Biography': '#ec4899',
    'Python & Data Science': '#10b981', 'Psychology & Probability': '#f59e0b',
    'Mathematics History': '#8b5cf6', 'Self Help': '#f97316', 'Productivity': '#eab308',
    'Science': '#06b6d4', 'Philosophy': '#a855f7', 'Technology': '#3b82f6', 'Other': '#6366f1',
};
const FALLBACK_BOOKS = [
    { id: 'b1', title: 'Atomic Habits', author: 'James Clear', genre: 'Self Help', rating: 5, excerpt: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.', readDate: 'Jan 2025' },
    { id: 'b2', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology & Probability', rating: 4, excerpt: 'A fascinating tour of the mind exploring the two systems that drive the way we think.', readDate: 'Dec 2024' },
    { id: 'b3', title: "Fermat's Enigma", author: 'Simon Singh', genre: 'Mathematics History', rating: 5, excerpt: "The epic quest to solve the world's greatest mathematical problem.", readDate: 'Oct 2024' },
    { id: 'b4', title: 'The Man Who Knew Infinity', author: 'Robert Kanigel', genre: 'Biography', rating: 5, excerpt: 'The remarkable life of Srinivasa Ramanujan, a self-taught mathematical genius.', readDate: 'Sep 2024' },
];

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/books`)
            .then(r => setBooks(r.data?.length ? r.data : FALLBACK_BOOKS))
            .catch(() => setBooks(FALLBACK_BOOKS))
            .finally(() => setLoading(false));
    }, []);

    const getCover = (book, idx) => book.coverImage || FALLBACK_COVERS[idx % FALLBACK_COVERS.length];
    const genres = ['All', ...Array.from(new Set(books.map(b => b.genre).filter(Boolean)))];
    const filtered = books.filter(b => {
        const ms = !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase());
        const mg = activeGenre === 'All' || b.genre === activeGenre;
        return ms && mg;
    });

    return (
        <div className="bkp-wrapper">
            {/* ── Hero ── */}
            <section className="bkp-hero">
                <div className="bkp-hero__orb bkp-hero__orb--1" />
                <div className="bkp-hero__orb bkp-hero__orb--2" />
                <div className="bkp-hero__inner">
                    <nav className="bkp-breadcrumb">
                        <Link to="/">Home</Link> <BiChevronRight /> <span>Books</span>
                    </nav>
                    <div className="bkp-hero__badge">📚 Reading List</div>
                    <h1 className="bkp-hero__title">Books I've <span>Read</span></h1>
                    <p className="bkp-hero__sub">
                        Reviews, reflections &amp; recommendations from my personal library — mathematics, statistics, biography &amp; data science.
                    </p>
                    <div className="bkp-hero__counters">
                        <div className="bkp-hero__counter"><span className="bkp-hero__counter-num">{books.length}</span><span className="bkp-hero__counter-label">Books</span></div>
                        <div className="bkp-hero__counter-sep" />
                        <div className="bkp-hero__counter"><span className="bkp-hero__counter-num">{genres.length - 1}</span><span className="bkp-hero__counter-label">Genres</span></div>
                        <div className="bkp-hero__counter-sep" />
                        <div className="bkp-hero__counter"><span className="bkp-hero__counter-num">⭐ 4.8</span><span className="bkp-hero__counter-label">Avg Rating</span></div>
                    </div>
                </div>
                {/* floating books */}
                <div className="bkp-hero__books-float" aria-hidden="true">
                    <span>📖</span><span>📗</span><span>📙</span><span>📘</span>
                </div>
            </section>

            {/* ── Toolbar ── */}
            <div className="bkp-toolbar">
                <div className="bkp-toolbar__inner">
                    <div className="bkp-search">
                        <BiSearch className="bkp-search__icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search books, authors…"
                            className="bkp-search__input"
                        />
                        {search && <button className="bkp-search__clear" onClick={() => setSearch('')}>×</button>}
                    </div>
                    <div className="bkp-genres">
                        {genres.map(g => (
                            <button
                                key={g}
                                className={`bkp-genre-btn${activeGenre === g ? ' active' : ''}`}
                                style={activeGenre === g && g !== 'All' ? { '--gc': GENRE_COLORS[g] || '#7c6ff7' } : {}}
                                onClick={() => setActiveGenre(g)}
                            >{g}</button>
                        ))}
                    </div>
                    <div className="bkp-view-toggle">
                        <button className={`bkp-vt${viewMode === 'grid' ? ' bkp-vt--active' : ''}`} onClick={() => setViewMode('grid')}>⊞</button>
                        <button className={`bkp-vt${viewMode === 'list' ? ' bkp-vt--active' : ''}`} onClick={() => setViewMode('list')}>☰</button>
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="bkp-body">
                <div className="bkp-results-info">
                    <span>{filtered.length} {filtered.length === 1 ? 'book' : 'books'} found</span>
                </div>

                {loading ? (
                    <div className="bkp-loading"><div className="bkp-spinner" /><p>Loading books…</p></div>
                ) : filtered.length === 0 ? (
                    <div className="bkp-empty">
                        <BiBookOpen />
                        <p>No books found.</p>
                        <button onClick={() => { setSearch(''); setActiveGenre('All'); }}>Clear filters</button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="bkp-grid">
                        {filtered.map((book, idx) => {
                            const id = book._id || book.id;
                            const color = GENRE_COLORS[book.genre] || '#7c6ff7';
                            return (
                                <div className="bkp-card" key={id} style={{ '--bkc': color, animationDelay: `${idx * 60}ms` }}>
                                    <Link to={`/books/${id}`} className="bkp-card__cover-link">
                                        <div className="bkp-card__cover-wrap">
                                            <img src={getCover(book, idx)} alt={book.title} className="bkp-card__cover" />
                                            <div className="bkp-card__cover-shine" />
                                            <div className="bkp-card__hover-overlay">
                                                <span>Read Review</span>
                                            </div>
                                        </div>
                                        {book.featured && <span className="bkp-card__featured">✦ Featured</span>}
                                        {book.readDate && <span className="bkp-card__date-badge">📖 {book.readDate}</span>}
                                    </Link>
                                    <div className="bkp-card__body">
                                        <span className="bkp-card__genre" style={{ background: color + '18', color }}>
                                            {book.genre}
                                        </span>
                                        <h3 className="bkp-card__title">
                                            <Link to={`/books/${id}`}>{book.title}</Link>
                                        </h3>
                                        <p className="bkp-card__author">by {book.author}</p>
                                        <div className="bkp-card__stars">
                                            {[1,2,3,4,5].map(s => (
                                                <span key={s} style={{ color: s <= (book.rating || 5) ? '#f59e0b' : 'rgba(150,120,80,0.25)' }}>★</span>
                                            ))}
                                        </div>
                                        <p className="bkp-card__excerpt">{book.excerpt}</p>
                                        <div className="bkp-card__actions">
                                            <Link to={`/books/${id}`} className="bkp-card__review-btn">Read Review →</Link>
                                            {book.downloadLink && (
                                                <a href={book.downloadLink} target="_blank" rel="noreferrer" className="bkp-card__dl-btn">
                                                    <BiDownload /> PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* List view */
                    <div className="bkp-list">
                        {filtered.map((book, idx) => {
                            const id = book._id || book.id;
                            const color = GENRE_COLORS[book.genre] || '#7c6ff7';
                            return (
                                <div className="bkp-list-item" key={id} style={{ '--bkc': color }}>
                                    <Link to={`/books/${id}`} className="bkp-list-item__cover-link">
                                        <img src={getCover(book, idx)} alt={book.title} className="bkp-list-item__cover" />
                                    </Link>
                                    <div className="bkp-list-item__info">
                                        <span className="bkp-list-item__genre" style={{ background: color + '18', color }}>{book.genre}</span>
                                        <h3 className="bkp-list-item__title"><Link to={`/books/${id}`}>{book.title}</Link></h3>
                                        <p className="bkp-list-item__author">by {book.author}</p>
                                        <div className="bkp-list-item__stars">
                                            {[1,2,3,4,5].map(s => (
                                                <span key={s} style={{ color: s <= (book.rating || 5) ? '#f59e0b' : 'rgba(150,120,80,0.25)' }}>★</span>
                                            ))}
                                        </div>
                                        <p className="bkp-list-item__excerpt">{book.excerpt}</p>
                                    </div>
                                    <div className="bkp-list-item__actions">
                                        <Link to={`/books/${id}`} className="bkp-card__review-btn">Read Review →</Link>
                                        {book.downloadLink && (
                                            <a href={book.downloadLink} target="_blank" rel="noreferrer" className="bkp-card__dl-btn">
                                                <BiDownload /> PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BooksPage;
