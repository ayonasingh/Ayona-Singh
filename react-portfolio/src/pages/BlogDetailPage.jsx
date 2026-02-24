import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BiCalendar, BiTime, BiTag, BiArrowBack, BiChevronRight } from 'react-icons/bi';
import axios from 'axios';
import '../pages/pages.css';
import './BlogDetailPage.css';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';

const BASE_URL = 'http://localhost:5000/api';

const FALLBACK_IMGS = [Img1, Img2, Img3, AyonaAbout];

/* Simple markdown-to-HTML renderer */
function renderContent(text) {
    if (!text) return '';
    return text
        // code blocks
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="blog-code-block"><code>$1</code></pre>')
        // headings
        .replace(/^## (.+)$/gm, '<h2 class="blog-content__h2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="blog-content__h3">$1</h3>')
        // bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // inline code
        .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
        // unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="blog-content__list">$1</ul>')
        // numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // horizontal rule
        .replace(/^---$/gm, '<hr class="blog-content__hr">')
        // paragraphs (blank lines)
        .split(/\n\n+/)
        .map(p => {
            const trimmed = p.trim();
            if (
                trimmed.startsWith('<h2') ||
                trimmed.startsWith('<h3') ||
                trimmed.startsWith('<pre') ||
                trimmed.startsWith('<ul') ||
                trimmed.startsWith('<hr')
            ) return trimmed;
            return `<p class="blog-content__p">${trimmed.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');
}

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        axios.get(`${BASE_URL}/blogs/${id}`)
            .then((res) => {
                setBlog(res.data);
                // Fetch related posts
                return axios.get(`${BASE_URL}/blogs`);
            })
            .then((res) => {
                if (res.data) {
                    const others = res.data.filter(b => (b.id || b._id) !== id);
                    setRelatedBlogs(others.slice(0, 3));
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    const getImage = (b, idx) => {
        if (b?.image) return b.image;
        return FALLBACK_IMGS[(idx || 0) % FALLBACK_IMGS.length];
    };

    if (loading) {
        return (
            <div className="blog-detail-loading">
                <div className="blog-detail-spinner" />
                <p>Loading article…</p>
            </div>
        );
    }

    if (notFound || !blog) {
        return (
            <div className="blog-detail-notfound">
                <h1>404</h1>
                <p>Blog post not found.</p>
                <Link to="/blogs" className="button button--flex">
                    <BiArrowBack /> Back to Blogs
                </Link>
            </div>
        );
    }

    const htmlContent = renderContent(blog.content);

    return (
        <div className="blog-detail-wrapper">
            {/* Hero */}
            <div className="blog-detail-hero" style={{ backgroundImage: `url(${getImage(blog, 0)})` }}>
                <div className="blog-detail-hero__overlay" />
                <div className="blog-detail-hero__content container">
                    {/* Breadcrumb */}
                    <nav className="blog-detail-breadcrumb">
                        <Link to="/">Home</Link>
                        <BiChevronRight />
                        <Link to="/blogs">Blogs</Link>
                        <BiChevronRight />
                        <span>{blog.tag}</span>
                    </nav>

                    <span className="blog-detail-hero__tag">{blog.tag}</span>
                    <h1 className="blog-detail-hero__title">{blog.title}</h1>

                    <div className="blog-detail-hero__meta">
                        <span><BiCalendar /> {blog.date}</span>
                        <span><BiTime /> {blog.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Article Body */}
            <div className="blog-detail-body container">
                <div className="blog-detail-content">
                    {/* Excerpt / lead */}
                    <p className="blog-detail-lead">{blog.excerpt}</p>

                    {/* Full content */}
                    {htmlContent ? (
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : (
                        <p className="blog-content__p" style={{ color: 'var(--text-color-light)', fontStyle: 'italic' }}>
                            Full article content coming soon…
                        </p>
                    )}

                    {/* Back */}
                    <div className="blog-detail-back">
                        <button className="button button--flex" onClick={() => navigate('/blogs')}>
                            <BiArrowBack className="button__icon" style={{ transform: 'rotate(0deg)' }} />
                            Back to Blogs
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="blog-detail-sidebar">
                    <div className="blog-detail-sidebar__card">
                        <h3 className="blog-detail-sidebar__heading">About the Author</h3>
                        <img src={AyonaAbout} alt="Ayona Singh" className="blog-detail-sidebar__avatar" />
                        <p className="blog-detail-sidebar__name">Ayona Singh</p>
                        <p className="blog-detail-sidebar__bio">
                            Mathematics student at Miranda House, University of Delhi. Passionate about calculus, statistics, and making math accessible to everyone.
                        </p>
                    </div>

                    <div className="blog-detail-sidebar__card">
                        <h3 className="blog-detail-sidebar__heading">
                            <BiTag style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                            Category
                        </h3>
                        <span className="blog-detail-sidebar__tag">{blog.tag}</span>
                    </div>

                    {relatedBlogs.length > 0 && (
                        <div className="blog-detail-sidebar__card">
                            <h3 className="blog-detail-sidebar__heading">Related Posts</h3>
                            <div className="blog-detail-related">
                                {relatedBlogs.map((rb, idx) => (
                                    <Link
                                        to={`/blogs/${rb.id || rb._id}`}
                                        className="blog-detail-related__item"
                                        key={rb.id || rb._id}
                                    >
                                        <img src={getImage(rb, idx + 1)} alt={rb.title} className="blog-detail-related__img" />
                                        <div>
                                            <p className="blog-detail-related__title">{rb.title}</p>
                                            <span className="blog-detail-related__date">
                                                <BiCalendar style={{ verticalAlign: 'middle' }} /> {rb.date}
                                            </span>
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
