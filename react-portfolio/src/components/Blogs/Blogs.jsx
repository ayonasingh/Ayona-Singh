import React, { useEffect, useState } from 'react';
import './Blogs.css';
import { BiRightArrowAlt, BiTime, BiCalendar } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Img1 from '../../assets/portfolio1.jpg';
import Img2 from '../../assets/portfolio2.jpg';
import Img3 from '../../assets/portfolio3.jpg';
import AyonaAbout from '../../assets/ayona_about.jpg';
import axios from 'axios';
import BASE_URL from '../../config/api';

const FALLBACK_IMGS = [Img1, Img2, Img3, AyonaAbout, Img1, Img2];

const FALLBACK_BLOGS = [
    { id: 1, tag: 'Calculus', date: 'Feb 10, 2026', readTime: '5 min read', title: 'Understanding Limits & Continuity in Real Analysis', excerpt: 'Limits are the backbone of calculus. In this post I break down what limits really mean, how to evaluate them, and why continuity matters so much in analysis.', link: '#' },
    { id: 2, tag: 'Statistics', date: 'Jan 28, 2026', readTime: '6 min read', title: 'Demystifying Probability Distributions for Beginners', excerpt: "From Binomial to Normal — understanding probability distributions can feel overwhelming. Here's a simple, visual guide to the most common ones used in statistics.", link: '#' },
    { id: 3, tag: 'Linear Algebra', date: 'Jan 15, 2026', readTime: '7 min read', title: 'Eigenvalues, Eigenvectors & Why They Matter', excerpt: "Eigenvalues are everywhere — from Google's PageRank to quantum mechanics. Let's explore what they are, how to compute them, and their real-world applications.", link: '#' },
    { id: 4, tag: 'Problem Solving', date: 'Jan 5, 2026', readTime: '4 min read', title: 'My Top 5 Strategies for Cracking Math Olympiad Problems', excerpt: "After competing in school-level Math Olympiads, I've picked up proven problem-solving strategies. Here are the five that helped me the most.", link: '#' },
    { id: 5, tag: 'Python & Math', date: 'Dec 22, 2025', readTime: '8 min read', title: 'How to Visualize Mathematical Functions with Python', excerpt: 'Matplotlib and NumPy make it incredibly easy to plot functions, surfaces, and data. Walk through creating beautiful math visualizations step by step.', link: '#' },
    { id: 6, tag: 'Study Tips', date: 'Dec 10, 2025', readTime: '3 min read', title: 'How I Stay Consistent With My Math Studies Every Day', excerpt: "Consistency beats intensity. Here's my personal routine — from morning problem sets to evening review — that keeps me sharp and motivated as a math student.", link: '#' },
];

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/blogs`)
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setBlogs(res.data);
                } else {
                    setBlogs(FALLBACK_BLOGS);
                }
            })
            .catch(() => setBlogs(FALLBACK_BLOGS))
            .finally(() => setLoading(false));
    }, []);

    const getImage = (blog, index) => {
        if (blog.image) return blog.image;
        return FALLBACK_IMGS[index % FALLBACK_IMGS.length];
    };

    if (loading) {
        return (
            <section className="blogs section" id="blogs">
                <h2 className="section__title">Blogs</h2>
                <span className="section__subtitle">My thoughts &amp; learnings</span>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-light)' }}>Loading...</div>
            </section>
        );
    }

    return (
        <section className="blogs section" id="blogs">
            <h2 className="section__title">Blogs</h2>
            <span className="section__subtitle">My thoughts &amp; learnings</span>

            <div className="blogs__container container grid">
                {blogs.map((blog, index) => (
                    <article className="blogs__card" key={blog.id || blog._id}>
                        <div className="blogs__img-wrapper">
                            <img src={getImage(blog, index)} alt={blog.title} className="blogs__img" />
                            <span className="blogs__tag">{blog.tag}</span>
                        </div>

                        <div className="blogs__body">
                            <span className="blogs__date">
                                <BiCalendar /> {blog.date}
                            </span>

                            <h3 className="blogs__title">{blog.title}</h3>
                            <p className="blogs__excerpt">{blog.excerpt}</p>

                            <div className="blogs__footer">
                                <span className="blogs__read-time">
                                    <BiTime /> {blog.readTime}
                                </span>
                                <Link to={`/blogs/${blog.id || blog._id}`} className="blogs__link">
                                    Read More <BiRightArrowAlt className="blogs__link-icon" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Blogs;
