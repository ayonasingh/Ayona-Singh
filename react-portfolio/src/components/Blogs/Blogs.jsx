import React from 'react';
import './Blogs.css';
import { BiRightArrowAlt, BiTime, BiCalendar } from 'react-icons/bi';
import Img1 from '../../assets/portfolio1.jpg';
import Img2 from '../../assets/portfolio2.jpg';
import Img3 from '../../assets/portfolio3.jpg';
import AyonaAbout from '../../assets/ayona_about.jpg';

const blogs = [
    {
        id: 1,
        tag: 'Calculus',
        date: 'Feb 10, 2026',
        readTime: '5 min read',
        title: 'Understanding Limits & Continuity in Real Analysis',
        excerpt:
            'Limits are the backbone of calculus. In this post I break down what limits really mean, how to evaluate them, and why continuity matters so much in analysis.',
        img: Img1,
        link: '#',
    },
    {
        id: 2,
        tag: 'Statistics',
        date: 'Jan 28, 2026',
        readTime: '6 min read',
        title: 'Demystifying Probability Distributions for Beginners',
        excerpt:
            'From Binomial to Normal — understanding probability distributions can feel overwhelming. Here\'s a simple, visual guide to the most common ones used in statistics.',
        img: Img2,
        link: '#',
    },
    {
        id: 3,
        tag: 'Linear Algebra',
        date: 'Jan 15, 2026',
        readTime: '7 min read',
        title: 'Eigenvalues, Eigenvectors & Why They Matter',
        excerpt:
            'Eigenvalues are everywhere — from Google\'s PageRank to quantum mechanics. Let\'s explore what they are, how to compute them, and their real-world applications.',
        img: Img3,
        link: '#',
    },
    {
        id: 4,
        tag: 'Problem Solving',
        date: 'Jan 5, 2026',
        readTime: '4 min read',
        title: 'My Top 5 Strategies for Cracking Math Olympiad Problems',
        excerpt:
            'After competing in school-level Math Olympiads, I\'ve picked up proven problem-solving strategies. Here are the five that helped me the most.',
        img: AyonaAbout,
        link: '#',
    },
    {
        id: 5,
        tag: 'Python & Math',
        date: 'Dec 22, 2025',
        readTime: '8 min read',
        title: 'How to Visualize Mathematical Functions with Python',
        excerpt:
            'Matplotlib and NumPy make it incredibly easy to plot functions, surfaces, and data. Walk through creating beautiful math visualizations step by step.',
        img: Img1,
        link: '#',
    },
    {
        id: 6,
        tag: 'Study Tips',
        date: 'Dec 10, 2025',
        readTime: '3 min read',
        title: 'How I Stay Consistent With My Math Studies Every Day',
        excerpt:
            'Consistency beats intensity. Here\'s my personal routine — from morning problem sets to evening review — that keeps me sharp and motivated as a math student.',
        img: Img2,
        link: '#',
    },
];

const Blogs = () => {
    return (
        <section className="blogs section" id="blogs">
            <h2 className="section__title">Blogs</h2>
            <span className="section__subtitle">My thoughts & learnings</span>

            <div className="blogs__container container grid">
                {blogs.map((blog) => (
                    <article className="blogs__card" key={blog.id}>
                        <div className="blogs__img-wrapper">
                            <img src={blog.img} alt={blog.title} className="blogs__img" />
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
                                <a href={blog.link} className="blogs__link">
                                    Read More <BiRightArrowAlt className="blogs__link-icon" />
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Blogs;
