import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BooksPage.css';
import { BiBookOpen, BiSearch, BiStar, BiDownload, BiArrowBack } from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';

const BASE_URL = 'http://localhost:5000/api';
const FALLBACK_COVERS = [Img1, Img2, Img3];
const GENRE_COLORS = {
    'Mathematics': 'hsl(250,69%,54%)',
    'Statistics': 'hsl(200,80%,50%)',
    'Biography': 'hsl(320,65%,52%)',
    'Python & Data Science': 'hsl(160,60%,40%)',
    'Psychology & Probability': 'hsl(30,80%,52%)',
    'Mathematics History': 'hsl(270,65%,52%)',
    'Self Help': 'hsl(16,90%,52%)',
    'Productivity': 'hsl(45,95%,48%)',
    'Science': 'hsl(185,75%,40%)',
    'Philosophy': 'hsl(290,55%,48%)',
    'Technology': 'hsl(220,80%,52%)',
    'Other': 'hsl(230,40%,50%)',
};

function GenreBadge({ genre }) {
    const color = GENRE_COLORS[genre] || 'hsl(250,50%,50%)';
    return (
        <span className="books-genre-badge" style={{ '--badge-color': color }}>
            {genre}
        </span>
    );
}

function StarRating({ rating }) {
    return (
        <span className="books-stars">
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= rating ? '#f59e0b' : 'rgba(255,255,255,0.25)' }}>★</span>
            ))}
        </span>
    );
}

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/books`)
            .then(r => setBooks(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const genres = ['All', ...Array.from(new Set(books.map(b => b.genre).filter(Boolean)))];

    const filtered = books.filter(b => {
        const matchSearch = !search ||
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase());
        const matchGenre = activeGenre === 'All' || b.genre === activeGenre;
        return matchSearch && matchGenre;
    });

    const getCover = (book, idx) => book.coverImage || FALLBACK_COVERS[idx % FALLBACK_COVERS.length];

    return (
        <div className="books-page">
            {/* ───── Hero ───── */}
            <div className="books-page__hero">
                <div className="books-page__hero-overlay" />
                <div className="books-page__hero-content container">
                    <span className="books-page__hero-tag">📚 My Reading Journey</span>
                    <h1 className="books-page__hero-title">Books I've Read</h1>
                    <p className="books-page__hero-sub">
                        Reviews, reflections, and downloads from my personal library —
                        mathematics, statistics, biography, and data science.
                    </p>
                </div>
            </div>

            {/* ───── Filter Bar ───── */}
            <div className="books-filter-bar container">
                <div className="books-filter-bar__search">
                    <BiSearch className="books-filter-bar__search-icon" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search books or authors…"
                        className="books-filter-bar__input"
                    />
                </div>
                <div className="books-filter-bar__genres">
                    {genres.map(g => (
                        <button
                            key={g}
                            className={`books-filter-chip${activeGenre === g ? ' active' : ''}`}
                            onClick={() => setActiveGenre(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* ───── Books Grid ───── */}
            <div className="container books-page__body">
                {loading ? (
                    <div className="books-page__loading">
                        <div className="books-page__spinner" />
                        <p>Loading books…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="books-page__empty">
                        <BiBookOpen style={{ fontSize: '3rem', opacity: 0.3 }} />
                        <p>No books found.</p>
                    </div>
                ) : (
                    <div className="books-grid">
                        {filtered.map((book, idx) => {
                            const id = book._id || book.id;
                            return (
                                <div className="books-card" key={id}>
                                    {/* Cover */}
                                    <Link to={`/books/${id}`} className="books-card__cover-wrap">
                                        <img src={getCover(book, idx)} alt={book.title} className="books-card__cover-img" />
                                        <div className="books-card__cover-overlay">
                                            <span className="books-card__read-btn">Read Review</span>
                                        </div>
                                        {book.featured && <span className="books-card__featured">✦ Featured</span>}
                                    </Link>

                                    {/* Body */}
                                    <div className="books-card__body">
                                        <div className="books-card__meta">
                                            <GenreBadge genre={book.genre} />
                                            {book.publishedYear && <span className="books-card__year">{book.publishedYear}</span>}
                                        </div>
                                        <h3 className="books-card__title">
                                            <Link to={`/books/${id}`}>{book.title}</Link>
                                        </h3>
                                        <p className="books-card__author">by {book.author}</p>
                                        <StarRating rating={book.rating || 5} />
                                        <p className="books-card__excerpt">{book.excerpt}</p>

                                        <div className="books-card__footer">
                                            <Link to={`/books/${id}`} className="books-card__review-link">
                                                Read Review →
                                            </Link>
                                            {book.downloadLink && (
                                                <a
                                                    href={book.downloadLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="books-card__download"
                                                >
                                                    <BiDownload /> Download
                                                </a>
                                            )}
                                        </div>
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
