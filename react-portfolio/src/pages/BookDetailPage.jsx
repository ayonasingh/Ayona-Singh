import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/api';
import './BookDetailPageNew.css';
import { BiArrowBack, BiDownload, BiChevronRight, BiCalendar, BiBook, BiUser, BiGlobe, BiShare } from 'react-icons/bi';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';
const FALLBACK_COVERS = [Img1, Img2, Img3];
const GENRE_COLORS = {
    'Mathematics': '#7c6ff7', 'Statistics': '#0ea5e9', 'Biography': '#ec4899',
    'Python & Data Science': '#10b981', 'Psychology & Probability': '#f59e0b',
    'Mathematics History': '#8b5cf6', 'Self Help': '#f97316', 'Productivity': '#eab308',
    'Science': '#06b6d4', 'Philosophy': '#a855f7', 'Technology': '#3b82f6', 'Other': '#6366f1',
};

function renderContent(text) {
    if (!text) return '';
    return text
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bkdp-code-block"><code>$1</code></pre>')
        .replace(/^## (.+)$/gm, '<h2 class="bkdp-h2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="bkdp-h3">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bkdp-inline-code">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="bkdp-list">$1</ul>')
        .replace(/^---$/gm, '<hr class="bkdp-hr">')
        .split(/\n\n+/)
        .map(p => {
            const t = p.trim();
            if (t.startsWith('<h2') || t.startsWith('<h3') || t.startsWith('<pre') || t.startsWith('<ul') || t.startsWith('<hr')) return t;
            return `<p class="bkdp-p">${t.replace(/\n/g, '<br/>')}</p>`;
        }).join('\n');
}

function StarRating({ rating, large }) {
    return (
        <div className={`bkdp-stars${large ? ' bkdp-stars--large' : ''}`}>
            {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= rating ? '#f59e0b' : 'rgba(150,120,80,0.25)' }}>★</span>
            ))}
            {large && <span className="bkdp-stars__label">{rating} / 5</span>}
        </div>
    );
}

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/books/${id}`)
            .then(r => { setBook(r.data); return axios.get(`${BASE_URL}/books`); })
            .then(r => {
                const others = r.data?.filter(b => (b._id || b.id) !== id) || [];
                setRelated(others.slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setReadProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getCover = (b, idx) => b?.coverImage || FALLBACK_COVERS[(idx || 0) % FALLBACK_COVERS.length];

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) return (
        <div className="bkdp-loading"><div className="bkdp-spinner" /><p>Loading book…</p></div>
    );
    if (notFound || !book) return (
        <div className="bkdp-notfound">
            <div className="bkdp-notfound__icon">📚</div>
            <h1>404</h1>
            <p>Book not found.</p>
            <Link to="/books" className="bkdp-back-btn"><BiArrowBack /> Back to Books</Link>
        </div>
    );

    const genreColor = GENRE_COLORS[book.genre] || '#7c6ff7';
    const htmlContent = renderContent(book.review);

    return (
        <div className="bkdp-wrapper">
            <div className="bkdp-progress" style={{ width: `${readProgress}%` }} />

            {/* ── Hero ── */}
            <header className="bkdp-hero" style={{ '--gc': genreColor }}>
                <div className="bkdp-hero__bg" />
                <div className="bkdp-hero__orb bkdp-hero__orb--1" />
                <div className="bkdp-hero__orb bkdp-hero__orb--2" />

                <div className="bkdp-hero__inner">
                    <nav className="bkdp-breadcrumb">
                        <Link to="/">Home</Link> <BiChevronRight />
                        <Link to="/books">Books</Link> <BiChevronRight />
                        <span>{book.genre}</span>
                    </nav>

                    <div className="bkdp-hero__layout">
                        {/* Cover */}
                        <div className="bkdp-hero__cover-wrap">
                            <img src={getCover(book, 0)} alt={book.title} className="bkdp-hero__cover" />
                            <div className="bkdp-hero__cover-glow" />
                            <div className="bkdp-hero__cover-shadow" />
                        </div>

                        {/* Meta */}
                        <div className="bkdp-hero__meta">
                            <span className="bkdp-hero__genre" style={{ background: genreColor + '22', color: genreColor, border: `1px solid ${genreColor}44` }}>
                                {book.genre}
                            </span>
                            <h1 className="bkdp-hero__title">{book.title}</h1>
                            <p className="bkdp-hero__author"><BiUser /> by {book.author}</p>
                            <StarRating rating={book.rating || 5} large />

                            <div className="bkdp-hero__stats">
                                {book.publishedYear && (
                                    <div className="bkdp-stat"><BiCalendar /><span>{book.publishedYear}</span><label>Published</label></div>
                                )}
                                {book.pageCount && (
                                    <div className="bkdp-stat"><BiBook /><span>{book.pageCount}</span><label>Pages</label></div>
                                )}
                                {book.language && (
                                    <div className="bkdp-stat"><BiGlobe /><span>{book.language}</span><label>Language</label></div>
                                )}
                                {book.readDate && (
                                    <div className="bkdp-stat"><span>📖</span><span>{book.readDate}</span><label>Read</label></div>
                                )}
                            </div>

                            <div className="bkdp-hero__actions">
                                {book.downloadLink && (
                                    <a href={book.downloadLink} target="_blank" rel="noreferrer" className="bkdp-download-btn">
                                        <BiDownload /> Download PDF
                                    </a>
                                )}
                                <button className="bkdp-share-btn" onClick={handleShare}>
                                    <BiShare /> {copied ? 'Copied!' : 'Share'}
                                </button>
                                <button className="bkdp-back-btn-ghost" onClick={() => navigate('/books')}>
                                    <BiArrowBack /> Books
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="bkdp-body">
                {/* Main review */}
                <main className="bkdp-review">
                    <p className="bkdp-lead">{book.excerpt}</p>

                    {htmlContent ? (
                        <div className="bkdp-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                        <p className="bkdp-placeholder">Full review coming soon…</p>
                    )}

                    {book.downloadLink && (
                        <div className="bkdp-cta-box">
                            <div className="bkdp-cta-box__text">
                                <h3>📥 Get This Book</h3>
                                <p>Download the PDF and start reading today!</p>
                            </div>
                            <a href={book.downloadLink} target="_blank" rel="noreferrer" className="bkdp-download-btn">
                                <BiDownload /> Download Free PDF
                            </a>
                        </div>
                    )}

                    <div className="bkdp-reviewer-strip">
                        <img src={AyonaAbout} alt="Ayona Singh" className="bkdp-reviewer-strip__avatar" />
                        <div>
                            <p className="bkdp-reviewer-strip__name">Reviewed by Ayona Singh</p>
                            <p className="bkdp-reviewer-strip__bio">Mathematics student & avid reader of math, statistics and data science literature.</p>
                        </div>
                    </div>

                    <div className="bkdp-nav-row">
                        <button className="bkdp-back-btn" onClick={() => navigate('/books')}>
                            <BiArrowBack /> All Books
                        </button>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="bkdp-sidebar">
                    {/* Reviewer */}
                    <div className="bkdp-sidebar__card">
                        <h3 className="bkdp-sidebar__title">Reviewed by</h3>
                        <img src={AyonaAbout} alt="Ayona" className="bkdp-sidebar__avatar" />
                        <p className="bkdp-sidebar__name">Ayona Singh</p>
                        <p className="bkdp-sidebar__bio">Mathematics student at Vivekananda College, University of Delhi. Avid reader of math, statistics & data science.</p>
                    </div>

                    {/* Book Details */}
                    <div className="bkdp-sidebar__card bkdp-sidebar__card--details">
                        <h3 className="bkdp-sidebar__title">Book Details</h3>
                        <ul className="bkdp-info-list">
                            {book.author && <li><span>Author</span><strong>{book.author}</strong></li>}
                            {book.genre && <li><span>Genre</span><strong style={{ color: genreColor }}>{book.genre}</strong></li>}
                            {book.publishedYear && <li><span>Published</span><strong>{book.publishedYear}</strong></li>}
                            {book.pageCount && <li><span>Pages</span><strong>{book.pageCount}</strong></li>}
                            {book.language && <li><span>Language</span><strong>{book.language}</strong></li>}
                            {book.readDate && <li><span>Read In</span><strong>{book.readDate}</strong></li>}
                            <li><span>My Rating</span><strong><StarRating rating={book.rating || 5} /></strong></li>
                        </ul>
                    </div>

                    {/* Related */}
                    {related.length > 0 && (
                        <div className="bkdp-sidebar__card">
                            <h3 className="bkdp-sidebar__title">More Books</h3>
                            <div className="bkdp-related">
                                {related.map((rb, idx) => (
                                    <Link to={`/books/${rb._id || rb.id}`} className="bkdp-related__item" key={rb._id || rb.id}>
                                        <img src={getCover(rb, idx + 1)} alt={rb.title} className="bkdp-related__cover" />
                                        <div>
                                            <p className="bkdp-related__title">{rb.title}</p>
                                            <p className="bkdp-related__author">by {rb.author}</p>
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
