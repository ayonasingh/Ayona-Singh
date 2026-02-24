import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetailPage.css';
import {
    BiArrowBack, BiDownload, BiChevronRight,
    BiCalendar, BiBook, BiUser, BiGlobe,
} from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';

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

/* Markdown → HTML (same renderer as BlogDetailPage) */
function renderContent(text) {
    if (!text) return '';
    return text
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="book-code-block"><code>$1</code></pre>')
        .replace(/^## (.+)$/gm, '<h2 class="book-content__h2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="book-content__h3">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="book-inline-code">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="book-content__list">$1</ul>')
        .replace(/^---$/gm, '<hr class="book-content__hr" />')
        .split(/\n\n+/)
        .map(p => {
            const t = p.trim();
            if (t.startsWith('<h2') || t.startsWith('<h3') || t.startsWith('<pre')
                || t.startsWith('<ul') || t.startsWith('<hr')) return t;
            return `<p class="book-content__p">${t.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');
}

function StarRating({ rating, large }) {
    const size = large ? '1.5rem' : '1rem';
    return (
        <span className="book-stars" style={{ fontSize: size }}>
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= rating ? '#f59e0b' : 'rgba(150,120,80,0.3)' }}>★</span>
            ))}
            {large && <span className="book-stars__label">{rating}/5</span>}
        </span>
    );
}

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/books/${id}`)
            .then(r => {
                setBook(r.data);
                return axios.get(`${BASE_URL}/books`);
            })
            .then(r => {
                const others = r.data.filter(b => (b._id || b.id) !== id);
                setRelated(others.slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    const getCover = (b, idx) => b?.coverImage || FALLBACK_COVERS[(idx || 0) % FALLBACK_COVERS.length];
    const genreColor = book ? (GENRE_COLORS[book.genre] || 'hsl(250,69%,54%)') : 'hsl(250,69%,54%)';

    if (loading) return (
        <div className="book-detail-loading">
            <div className="book-detail-spinner" />
            <p>Loading book…</p>
        </div>
    );

    if (notFound || !book) return (
        <div className="book-detail-notfound">
            <h1>404</h1>
            <p>Book not found.</p>
            <Link to="/books" className="button button--flex"><BiArrowBack /> Back to Books</Link>
        </div>
    );

    const htmlContent = renderContent(book.review);

    return (
        <div className="book-detail-wrapper">
            {/* ───── Hero ───── */}
            <div className="book-detail-hero" style={{ '--genre-color': genreColor }}>
                <div className="book-detail-hero__bg" />
                <div className="container book-detail-hero__inner">
                    {/* Breadcrumb */}
                    <nav className="book-detail-breadcrumb">
                        <Link to="/">Home</Link>
                        <BiChevronRight />
                        <Link to="/books">Books</Link>
                        <BiChevronRight />
                        <span>{book.genre}</span>
                    </nav>

                    <div className="book-detail-hero__layout">
                        {/* Cover */}
                        <div className="book-detail-hero__cover-wrap">
                            <img src={getCover(book, 0)} alt={book.title} className="book-detail-hero__cover" />
                            <div className="book-detail-hero__cover-glow" />
                        </div>

                        {/* Meta */}
                        <div className="book-detail-hero__meta">
                            <span className="book-detail-hero__genre" style={{ background: genreColor }}>{book.genre}</span>
                            <h1 className="book-detail-hero__title">{book.title}</h1>
                            <p className="book-detail-hero__author"><BiUser style={{ verticalAlign: 'middle' }} /> by {book.author}</p>

                            <StarRating rating={book.rating || 5} large />

                            <div className="book-detail-hero__stats">
                                {book.publishedYear && (
                                    <span><BiCalendar /> Published {book.publishedYear}</span>
                                )}
                                {book.pageCount && (
                                    <span><BiBook /> {book.pageCount} pages</span>
                                )}
                                {book.language && (
                                    <span><BiGlobe /> {book.language}</span>
                                )}
                                {book.readDate && (
                                    <span>📖 Read {book.readDate}</span>
                                )}
                            </div>

                            {book.downloadLink && (
                                <a href={book.downloadLink} target="_blank" rel="noreferrer" className="book-detail-hero__download">
                                    <BiDownload className="book-detail-hero__download-icon" />
                                    Download Book (PDF)
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ───── Body ───── */}
            <div className="book-detail-body container">
                {/* Review */}
                <main className="book-detail-content">
                    <p className="book-detail-lead">{book.excerpt}</p>

                    {htmlContent ? (
                        <div className="book-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                        <p style={{ color: 'var(--text-color-light)', fontStyle: 'italic', fontFamily: 'var(--body-font)' }}>
                            Full review coming soon…
                        </p>
                    )}

                    {book.downloadLink && (
                        <div className="book-detail-cta-box">
                            <div>
                                <h3 className="book-detail-cta-box__title">📥 Get This Book</h3>
                                <p className="book-detail-cta-box__text">Download the PDF and start reading today!</p>
                            </div>
                            <a href={book.downloadLink} target="_blank" rel="noreferrer" className="book-detail-hero__download">
                                <BiDownload /> Download Free PDF
                            </a>
                        </div>
                    )}

                    <div className="book-detail-back">
                        <button className="button button--flex" onClick={() => navigate('/books')}>
                            <BiArrowBack className="button__icon" /> Back to Books
                        </button>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="book-detail-sidebar">
                    {/* Author card */}
                    <div className="book-detail-sidebar__card">
                        <h3 className="book-detail-sidebar__heading">Reviewed by</h3>
                        <img src={AyonaAbout} alt="Ayona Singh" className="book-detail-sidebar__avatar" />
                        <p className="book-detail-sidebar__name">Ayona Singh</p>
                        <p className="book-detail-sidebar__bio">
                            Mathematics student at Vivekananda College, University of Delhi. Avid reader of math, statistics, Machine Learning, and data science literature.
                        </p>
                    </div>

                    {/* Book details card */}
                    <div className="book-detail-sidebar__card">
                        <h3 className="book-detail-sidebar__heading">Book Details</h3>
                        <ul className="book-detail-info-list">
                            {book.author && <li><span>Author</span><strong>{book.author}</strong></li>}
                            {book.genre && <li><span>Genre</span><strong>{book.genre}</strong></li>}
                            {book.publishedYear && <li><span>Published</span><strong>{book.publishedYear}</strong></li>}
                            {book.pageCount && <li><span>Pages</span><strong>{book.pageCount}</strong></li>}
                            {book.language && <li><span>Language</span><strong>{book.language}</strong></li>}
                            {book.readDate && <li><span>Read</span><strong>{book.readDate}</strong></li>}
                            <li>
                                <span>My Rating</span>
                                <strong><StarRating rating={book.rating || 5} /></strong>
                            </li>
                        </ul>
                    </div>

                    {/* Related books */}
                    {related.length > 0 && (
                        <div className="book-detail-sidebar__card">
                            <h3 className="book-detail-sidebar__heading">More Books</h3>
                            <div className="book-detail-related">
                                {related.map((rb, idx) => (
                                    <Link to={`/books/${rb._id || rb.id}`} className="book-detail-related__item" key={rb._id || rb.id}>
                                        <img src={getCover(rb, idx + 1)} alt={rb.title} className="book-detail-related__img" />
                                        <div>
                                            <p className="book-detail-related__title">{rb.title}</p>
                                            <p className="book-detail-related__author">by {rb.author}</p>
                                            <StarRating rating={rb.rating || 5} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default BookDetailPage;
