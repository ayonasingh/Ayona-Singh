import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BiCalendar, BiTime, BiArrowBack, BiChevronRight, BiShare, BiBookmark, BiUser } from 'react-icons/bi';
import axios from 'axios';
import './BlogDetailPageNew.css';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';

const BASE_URL = 'http://localhost:5000/api';
const FALLBACK_IMGS = [Img1, Img2, Img3, AyonaAbout];

function renderContent(text) {
    if (!text) return '';
    return text
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bdp-code-block"><code>$1</code></pre>')
        .replace(/^## (.+)$/gm, '<h2 class="bdp-h2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="bdp-h3">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bdp-inline-code">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="bdp-list">$1</ul>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/^---$/gm, '<hr class="bdp-hr">')
        .split(/\n\n+/)
        .map(p => {
            const t = p.trim();
            if (t.startsWith('<h2') || t.startsWith('<h3') || t.startsWith('<pre') || t.startsWith('<ul') || t.startsWith('<hr')) return t;
            return `<p class="bdp-p">${t.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');
}

const TAG_COLORS = {
    'Calculus': '#7c6ff7', 'Statistics': '#0ea5e9', 'Linear Algebra': '#10b981',
    'Problem Solving': '#f59e0b', 'Python & Math': '#3b82f6', 'Study Tips': '#ec4899',
};

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`${BASE_URL}/blogs/${id}`)
            .then(res => {
                setBlog(res.data);
                return axios.get(`${BASE_URL}/blogs`);
            })
            .then(res => {
                const others = res.data?.filter(b => (b.id || b._id) !== id) || [];
                setRelatedBlogs(others.slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const max = el.scrollHeight - el.clientHeight;
            setReadProgress(max > 0 ? (scrolled / max) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getImage = (b, idx) => b?.image || FALLBACK_IMGS[(idx || 0) % FALLBACK_IMGS.length];
    const tagColor = blog ? (TAG_COLORS[blog.tag] || '#7c6ff7') : '#7c6ff7';

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) return (
        <div className="bdp-loading">
            <div className="bdp-spinner" />
            <p>Loading article…</p>
        </div>
    );

    if (notFound || !blog) return (
        <div className="bdp-notfound">
            <div className="bdp-notfound__icon">📄</div>
            <h1>404</h1>
            <p>Blog post not found.</p>
            <Link to="/blogs" className="bdp-back-btn"><BiArrowBack /> Back to Blogs</Link>
        </div>
    );

    const htmlContent = renderContent(blog.content);

    return (
        <div className="bdp-wrapper">
            {/* Reading progress bar */}
            <div className="bdp-progress" style={{ width: `${readProgress}%` }} />

            {/* ── Hero ── */}
            <header className="bdp-hero" style={{ '--tag-c': tagColor }}>
                <div className="bdp-hero__img-wrap">
                    <img src={getImage(blog, 0)} alt={blog.title} className="bdp-hero__img" />
                    <div className="bdp-hero__overlay" />
                </div>
                <div className="bdp-hero__content">
                    <nav className="bdp-breadcrumb">
                        <Link to="/">Home</Link> <BiChevronRight />
                        <Link to="/blogs">Blogs</Link> <BiChevronRight />
                        <span>{blog.tag}</span>
                    </nav>
                    <span className="bdp-hero__tag" style={{ background: tagColor }}>{blog.tag}</span>
                    <h1 className="bdp-hero__title">{blog.title}</h1>
                    <div className="bdp-hero__meta">
                        <span className="bdp-hero__meta-item"><BiCalendar />{blog.date}</span>
                        <span className="bdp-hero__meta-sep" />
                        <span className="bdp-hero__meta-item"><BiTime />{blog.readTime || '5 min read'}</span>
                        <span className="bdp-hero__meta-sep" />
                        <span className="bdp-hero__meta-item"><BiUser />Ayona Singh</span>
                    </div>
                    <div className="bdp-hero__actions">
                        <button className="bdp-hero__action-btn" onClick={handleShare}>
                            <BiShare /> {copied ? 'Link Copied!' : 'Share'}
                        </button>
                        <button className="bdp-hero__action-btn"><BiBookmark /> Save</button>
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="bdp-body">
                {/* Main Article */}
                <main className="bdp-article">
                    {/* Lead */}
                    <p className="bdp-lead">{blog.excerpt}</p>

                    {/* Content */}
                    {htmlContent ? (
                        <div className="bdp-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                        <p className="bdp-content-placeholder">Full article content coming soon…</p>
                    )}

                    {/* Author card at bottom */}
                    <div className="bdp-author-strip">
                        <img src={AyonaAbout} alt="Ayona Singh" className="bdp-author-strip__avatar" />
                        <div>
                            <p className="bdp-author-strip__name">Written by Ayona Singh</p>
                            <p className="bdp-author-strip__bio">Mathematics student at Miranda House, University of Delhi. Passionate about calculus, statistics and making math accessible.</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="bdp-nav-row">
                        <button className="bdp-back-btn" onClick={() => navigate('/blogs')}>
                            <BiArrowBack /> All Articles
                        </button>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="bdp-sidebar">
                    {/* Author */}
                    <div className="bdp-sidebar__card">
                        <h3 className="bdp-sidebar__title">About the Author</h3>
                        <img src={AyonaAbout} alt="Ayona" className="bdp-sidebar__avatar" />
                        <p className="bdp-sidebar__name">Ayona Singh</p>
                        <p className="bdp-sidebar__bio">
                            Mathematics student at Miranda House, University of Delhi. Passionate about calculus, statistics, and making math accessible to everyone.
                        </p>
                    </div>

                    {/* Tag */}
                    <div className="bdp-sidebar__card">
                        <h3 className="bdp-sidebar__title">Topic</h3>
                        <span className="bdp-sidebar__tag" style={{ background: tagColor + '18', color: tagColor, border: `1px solid ${tagColor}40` }}>
                            {blog.tag}
                        </span>
                    </div>

                    {/* Related */}
                    {relatedBlogs.length > 0 && (
                        <div className="bdp-sidebar__card">
                            <h3 className="bdp-sidebar__title">More Articles</h3>
                            <div className="bdp-related">
                                {relatedBlogs.map((rb, idx) => (
                                    <Link to={`/blogs/${rb.id || rb._id}`} className="bdp-related__item" key={rb.id || rb._id}>
                                        <img src={getImage(rb, idx + 1)} alt={rb.title} className="bdp-related__img" />
                                        <div>
                                            <p className="bdp-related__title">{rb.title}</p>
                                            <span className="bdp-related__date"><BiCalendar />{rb.date}</span>
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

export default BlogDetailPage;
