import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import '../pages/pages.css';
import axios from 'axios';

import AyonaHero from '../assets/ayona_profile.jpg';
import AyonaAbout from '../assets/ayona_about.jpg';
import Img1 from '../assets/portfolio1.jpg';
import Img2 from '../assets/portfolio2.jpg';
import Img3 from '../assets/portfolio3.jpg';

import {
    BiLogoLinkedin, BiLogoGithub, BiLogoInstagram,
    BiCalculator, BiBarChartAlt2, BiBook,
    BiRightArrowAlt, BiAward, BiCheckShield,
    BiCollection, BiMessageSquareDetail,
    BiTime, BiCalendar, BiTrophy, BiCodeBlock,
} from 'react-icons/bi';

const BASE_URL = 'http://localhost:5000/api';

/* ── Typing animation hook ── */
const DEFAULT_TYPED_STRINGS = [
    'Mathematics Student',
    'Data Analyst',
    'Math Tutor',
    'Problem Solver',
    'Research Enthusiast',
];

function useTyping(strings = DEFAULT_TYPED_STRINGS) {
    const [display, setDisplay] = useState('');
    const [index, setIndex] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = strings[index];
        const speed = deleting ? 50 : 100;

        const timer = setTimeout(() => {
            if (!deleting) {
                setDisplay(current.slice(0, charIdx + 1));
                if (charIdx + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 1600);
                } else {
                    setCharIdx(c => c + 1);
                }
            } else {
                setDisplay(current.slice(0, charIdx - 1));
                if (charIdx - 1 === 0) {
                    setDeleting(false);
                    setIndex(i => (i + 1) % strings.length);
                    setCharIdx(0);
                } else {
                    setCharIdx(c => c - 1);
                }
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [charIdx, deleting, index, strings]);

    return display;
}

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800, active) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return count;
}

/* ── Scroll-reveal hook ── */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

/* ── Skill Bar component ── */
const SkillBar = ({ name, pct }) => {
    const [ref, visible] = useReveal();
    return (
        <div ref={ref}>
            <div className="lp-skill-bar__header">
                <span className="lp-skill-bar__name">{name}</span>
                <span className="lp-skill-bar__pct">{pct}%</span>
            </div>
            <div className="lp-skill-bar__track">
                <div className="lp-skill-bar__fill"
                    style={{ width: visible ? `${pct}%` : '0%' }} />
            </div>
        </div>
    );
};

/* ── Stat Item ── */
const StatItem = ({ target, suffix, label, active }) => {
    const count = useCounter(target, 1800, active);
    return (
        <div className="lp-stats__item">
            <div className="lp-stats__number">{count}{suffix}</div>
            <div className="lp-stats__label">{label}</div>
        </div>
    );
};

/* ── What-I-do cards ── */
const WHAT_CARDS = [
    {
        icon: <BiCalculator />,
        title: 'Math Tutoring',
        text: 'Personalized one-on-one tutoring in Calculus, Algebra, Statistics, and competitive exam preparation (JEE, Olympiads).',
        link: '/contact',
        linkText: 'Book a session',
    },
    {
        icon: <BiBarChartAlt2 />,
        title: 'Data Analysis',
        text: 'Statistical analysis, data visualization, and report writing using Python, R, and Excel for academic and research projects.',
        link: '/contact',
        linkText: 'Collaborate',
    },
    {
        icon: <BiBook />,
        title: 'Academic Writing',
        text: 'LaTeX typesetting for math papers, writing and editing math-based assignments, and research documentation.',
        link: '/contact',
        linkText: 'Get in touch',
    },
    {
        icon: <BiCodeBlock />,
        title: 'Python & MATLAB',
        text: 'Mathematical modeling, simulation, and data-driven scripting in Python and MATLAB for research and coursework.',
        link: '/skills',
        linkText: 'See Skills',
    },
    {
        icon: <BiCheckShield />,
        title: 'Research Assistant',
        text: 'Supporting university research in algebra, number theory, and applied mathematics — literature review and proof checking.',
        link: '/about',
        linkText: 'Learn more',
    },
    {
        icon: <BiCollection />,
        title: 'Olympiad Coaching',
        text: 'Guided problem-solving sessions and practice material for Mathematics Olympiad aspirants at school and college level.',
        link: '/contact',
        linkText: 'Connect now',
    },
];

/* ── Blog previews ── */
const BLOG_PREVIEWS = [
    { tag: 'Calculus', date: 'Feb 10, 2026', title: 'Understanding Limits & Continuity in Real Analysis', excerpt: 'Limits are the backbone of calculus. In this post I break down what limits really mean and why continuity matters.', img: Img1 },
    { tag: 'Statistics', date: 'Jan 28, 2026', title: 'Demystifying Probability Distributions for Beginners', excerpt: 'From Binomial to Normal — a simple, visual guide to the most common probability distributions used in statistics.', img: Img2 },
    { tag: 'Linear Algebra', date: 'Jan 15, 2026', title: 'Eigenvalues, Eigenvectors & Why They Matter', excerpt: "Eigenvalues are everywhere — from Google's PageRank to quantum mechanics. Let's explore their real-world applications.", img: Img3 },
];

/* ── Fallback book cards ── */
const BOOK_FALLBACKS = [
    { id: 'b1', title: 'Atomic Habits', author: 'James Clear', genre: 'Self Help', rating: 5, excerpt: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.', coverImage: '', readDate: 'Jan 2025' },
    { id: 'b2', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology & Probability', rating: 4, excerpt: 'A fascinating tour of the mind exploring the two systems that drive the way we think.', coverImage: '', readDate: 'Dec 2024' },
    { id: 'b3', title: "Fermat's Enigma", author: 'Simon Singh', genre: 'Mathematics History', rating: 5, excerpt: 'The epic quest to solve the world\'s greatest mathematical problem — Fermat\'s Last Theorem.', coverImage: '', readDate: 'Oct 2024' },
    { id: 'b4', title: 'The Man Who Knew Infinity', author: 'Robert Kanigel', genre: 'Biography', rating: 5, excerpt: 'The remarkable life of Srinivasa Ramanujan, a self-taught mathematical genius from India.', coverImage: '', readDate: 'Sep 2024' },
];

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const HomePage = () => {
    const typed = useTyping();

    /* API data */
    const [heroData, setHeroData] = useState({ name: 'Ayona Singh', description: 'A passionate Mathematics student with a strong foundation in Calculus, Statistics, Linear Algebra & Mathematical Modelling. I love solving complex problems and applying mathematical reasoning to real-world challenges.' });
    const [skillBars, setSkillBars] = useState([
        { name: 'Calculus', pct: 90 }, { name: 'Linear Algebra', pct: 85 },
        { name: 'Statistics', pct: 80 }, { name: 'Python', pct: 72 },
        { name: 'MATLAB', pct: 60 }, { name: 'LaTeX', pct: 75 },
    ]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [featuredBooks, setFeaturedBooks] = useState(BOOK_FALLBACKS);
    const [contactInfo, setContactInfo] = useState({ linkedin: 'https://www.linkedin.com/in/ayona-singh-10b5561b8/', github: 'https://github.com/', instagram: 'https://www.instagram.com/' });

    useEffect(() => {
        // Fetch home section
        axios.get(`${BASE_URL}/home`).then((res) => {
            if (res.data) setHeroData(res.data);
        }).catch(() => { });

        // Fetch skills for progress bars
        axios.get(`${BASE_URL}/skills`).then((res) => {
            if (res.data) {
                const levelMap = { Advanced: 90, Intermediate: 70, Basic: 45 };
                const allSkills = [
                    ...(res.data.mathCore || []),
                    ...(res.data.tools || []),
                ].slice(0, 6).map((s) => ({ name: s.name, pct: levelMap[s.level] || 60 }));
                if (allSkills.length > 0) setSkillBars(allSkills);
            }
        }).catch(() => { });

        // Fetch blogs for "Recent Articles"
        axios.get(`${BASE_URL}/blogs`).then((res) => {
            if (res.data && res.data.length > 0) {
                setFeaturedBlogs(res.data.slice(0, 3));
            } else {
                setFeaturedBlogs(BLOG_PREVIEWS);
            }
        }).catch(() => setFeaturedBlogs(BLOG_PREVIEWS));

        // Fetch contact info for social links
        axios.get(`${BASE_URL}/contact-info`).then((res) => {
            if (res.data) setContactInfo(res.data);
        }).catch(() => { });

        // Fetch featured books
        axios.get(`${BASE_URL}/books`).then((res) => {
            if (res.data && res.data.length > 0) {
                // prefer featured, fall back to all, always show 4
                const featured = res.data.filter(b => b.featured);
                const toShow = (featured.length >= 4 ? featured : res.data).slice(0, 4);
                setFeaturedBooks(toShow);
            } else {
                setFeaturedBooks(BOOK_FALLBACKS);
            }
        }).catch(() => setFeaturedBooks(BOOK_FALLBACKS));
    }, []);

    const getBlogImage = (blog, index) => {
        if (blog.img) return blog.img;
        if (blog.image) return blog.image;
        const fallbacks = [Img1, Img2, Img3];
        return fallbacks[index % fallbacks.length];
    };

    /* Stats reveal */
    const [statsRef, statsVisible] = useReveal();

    /* Reveal refs */
    const [whatRef, whatVisible] = useReveal();
    const [skillRef, skillVisible] = useReveal();
    const [blogRef, blogVisible] = useReveal();
    const [bookRef, bookVisible] = useReveal();
    const [ctaRef, ctaVisible] = useReveal();

    return (
        <div className="page-wrapper" style={{ paddingTop: '4rem' }}>

            {/*══════ HERO ══════*/}
            <section className="lp-hero">
                {/* floating math symbols */}
                <span className="lp-hero__math">∑</span>
                <span className="lp-hero__math">∫</span>
                <span className="lp-hero__math">π</span>
                <span className="lp-hero__math">√</span>
                <span className="lp-hero__math">∞</span>
                <span className="lp-hero__math">θ</span>

                {/* background shapes */}
                <div className="lp-hero__shape lp-hero__shape--1" />
                <div className="lp-hero__shape lp-hero__shape--2" />
                <div className="lp-hero__shape lp-hero__shape--3" />

                <div className="lp-hero__container">
                    {/* Left: content */}
                    <div className="lp-hero__content">
                        <div className="lp-hero__greeting">
                            <span className="lp-hero__greeting-dot" />
                            Hello, I'm
                        </div>

                        <h1 className="lp-hero__name">
                            <span>{heroData.name || 'Ayona Singh'}</span>
                        </h1>

                        <div className="lp-hero__typed-wrap">
                            <span className="lp-hero__typed">{typed}</span>
                            <span className="lp-hero__cursor" />
                        </div>

                        <p className="lp-hero__description">
                            {heroData.description || 'A passionate Mathematics student with a strong foundation in Calculus, Statistics, Linear Algebra & Mathematical Modelling.'}
                        </p>

                        <div className="lp-hero__buttons">
                            <Link to="/contact" className="lp-hero__btn-primary">
                                <BiMessageSquareDetail /> Contact Me
                            </Link>
                            <Link to="/portfolio" className="lp-hero__btn-secondary">
                                <BiCollection /> View Work
                            </Link>
                        </div>

                        <div className="lp-hero__social">
                            <span className="lp-hero__social-label">Follow me</span>
                            <a href={contactInfo.linkedin || 'https://www.linkedin.com/in/ayona-singh-10b5561b8/'} className="lp-hero__social-link" target="_blank" rel="noreferrer">
                                <BiLogoLinkedin />
                            </a>
                            <a href={contactInfo.github || 'https://github.com/'} className="lp-hero__social-link" target="_blank" rel="noreferrer">
                                <BiLogoGithub />
                            </a>
                            <a href={contactInfo.instagram || 'https://www.instagram.com/'} className="lp-hero__social-link" target="_blank" rel="noreferrer">
                                <BiLogoInstagram />
                            </a>
                        </div>
                    </div>

                    {/* Right: photo */}
                    <div className="lp-hero__image-wrap">
                        <div className="lp-hero__img-ring">
                            <img src={AyonaHero} alt="Ayona Singh" className="lp-hero__photo" />
                        </div>

                        <div className="lp-hero__badge lp-hero__badge--1">
                            <BiTrophy className="lp-hero__badge-icon" />
                            <div className="lp-hero__badge-text">
                                <strong>Math Olympiad</strong>
                                <span>Award Winner</span>
                            </div>
                        </div>

                        <div className="lp-hero__badge lp-hero__badge--2">
                            <BiAward className="lp-hero__badge-icon" />
                            <div className="lp-hero__badge-text">
                                <strong>15+ Courses</strong>
                                <span>Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <Link to="/about" className="lp-hero__scroll">
                    <span className="lp-hero__scroll-text">Scroll</span>
                    <div className="lp-hero__scroll-mouse">
                        <div className="lp-hero__scroll-wheel" />
                    </div>
                </Link>
            </section>

            {/*══════ STATS ══════*/}
            <section className="lp-stats" ref={statsRef}>
                <div className="lp-stats__container">
                    <StatItem target={15} suffix="+" label="Courses Completed" active={statsVisible} />
                    <StatItem target={10} suffix="+" label="Math Projects" active={statsVisible} />
                    <StatItem target={3} suffix="" label="Academic Awards" active={statsVisible} />
                    <StatItem target={50} suffix="+" label="Students Tutored" active={statsVisible} />
                </div>
            </section>

            {/*══════ WHAT I DO ══════*/}
            <section className="lp-what" ref={whatRef}>
                <div className={`lp-section__header reveal ${whatVisible ? 'visible' : ''}`}>
                    <span className="lp-section__tag">What I Do</span>
                    <h2 className="lp-section__title">Services I Offer</h2>
                    <p className="lp-section__subtitle">
                        From tutoring and data analysis to academic writing and research, I help students and researchers with all things mathematics.
                    </p>
                </div>

                <div className="lp-what__grid">
                    {WHAT_CARDS.map((card, i) => (
                        <div
                            key={i}
                            className={`lp-what__card reveal ${whatVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <div className="lp-what__icon-wrap">{card.icon}</div>
                            <h3 className="lp-what__card-title">{card.title}</h3>
                            <p className="lp-what__card-text">{card.text}</p>
                            <Link to={card.link} className="lp-what__card-link">
                                {card.linkText} <BiRightArrowAlt />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/*══════ SKILLS HIGHLIGHT ══════*/}
            <section className="lp-skills" ref={skillRef}>
                <div className="lp-skills__container">
                    <div className={`lp-skills__img-wrap reveal-left ${skillVisible ? 'visible' : ''}`}>
                        <img src={AyonaAbout} alt="Ayona Singh" className="lp-skills__img" />
                        <div className="lp-skills__img-accent" />
                    </div>

                    <div className={`lp-skills__content reveal-right ${skillVisible ? 'visible' : ''}`}>
                        <span className="lp-section__tag">My Skills</span>
                        <h2>Mathematics &amp; Tools</h2>
                        <p>
                            I have built a strong foundation in core mathematics subjects and
                            complementary technical tools used in research and data science.
                        </p>

                        <div className="lp-skills__bars">
                            {skillBars.map((s) => (
                                <SkillBar key={s.name} name={s.name} pct={s.pct} />
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <Link to="/skills" className="lp-hero__btn-primary">
                                All Skills <BiRightArrowAlt />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/*══════ FEATURED BLOGS ══════*/}
            <section className="lp-blogs" ref={blogRef}>
                <div className={`lp-section__header reveal ${blogVisible ? 'visible' : ''}`}>
                    <span className="lp-section__tag">Blog</span>
                    <h2 className="lp-section__title">Recent Articles</h2>
                    <p className="lp-section__subtitle">
                        Thoughts, tutorials and insights on Mathematics, Data Science and student life.
                    </p>
                </div>

                <div className="lp-blogs__grid">
                    {featuredBlogs.map((b, i) => (
                        <div
                            key={i}
                            className={`lp-blog-card reveal ${blogVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.12}s` }}
                        >
                            <div className="lp-blog-card__img-wrap">
                                <img src={getBlogImage(b, i)} alt={b.title} className="lp-blog-card__img" />
                                <span className="lp-blog-card__tag">{b.tag}</span>
                            </div>
                            <div className="lp-blog-card__body">
                                <h3 className="lp-blog-card__title">{b.title}</h3>
                                <p className="lp-blog-card__excerpt">{b.excerpt}</p>
                                <div className="lp-blog-card__footer">
                                    <span className="lp-blog-card__date">
                                        <BiCalendar style={{ verticalAlign: 'middle', marginRight: 3 }} />
                                        {b.date}
                                    </span>
                                    <Link to={`/blogs/${b.id || b._id}`} className="lp-blog-card__link">
                                        Read <BiRightArrowAlt />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lp-blogs__cta">
                    <Link to="/blogs" className="lp-hero__btn-secondary">
                        View All Blogs <BiRightArrowAlt />
                    </Link>
                </div>
            </section>

            {/*══════ BOOKS ══════*/}
            <section className="lp-books" ref={bookRef}>
                <div className={`lp-section__header reveal ${bookVisible ? 'visible' : ''}`}>
                    <span className="lp-section__tag">📚 Reading List</span>
                    <h2 className="lp-section__title">Books I Recommend</h2>
                    <p className="lp-section__subtitle">
                        Reviews and reflections from my personal library — mathematics, statistics, biography &amp; data science.
                    </p>
                </div>

                <div className="lp-books__grid">
                    {featuredBooks.map((book, i) => {
                        const id = book._id || book.id;
                        const cover = book.coverImage || [Img1, Img2, Img3][i % 3];
                        const genreColors = {
                            'Mathematics': '#6d28d9', 'Statistics': '#0284c7', 'Biography': '#9d174d',
                            'Python & Data Science': '#065f46', 'Psychology & Probability': '#c2410c',
                            'Mathematics History': '#5b21b6', 'Self Help': '#ea580c',
                            'Productivity': '#b45309', 'Science': '#0e7490', 'Other': '#4338ca',
                        };
                        const genreColor = genreColors[book.genre] || '#6d28d9';
                        return (
                            <div
                                key={id}
                                className={`lp-book-card reveal ${bookVisible ? 'visible' : ''}`}
                                style={{ transitionDelay: `${i * 0.1}s` }}
                            >
                                <Link to={`/books/${id}`} className="lp-book-card__cover-link">
                                    <img src={cover} alt={book.title} className="lp-book-card__cover" />
                                    <div className="lp-book-card__cover-shine" />
                                    {book.readDate && (
                                        <span className="lp-book-card__read-badge">📖 {book.readDate}</span>
                                    )}
                                </Link>
                                <div className="lp-book-card__body">
                                    <span className="lp-book-card__genre"
                                        style={{ background: genreColor + '22', color: genreColor }}>
                                        {book.genre}
                                    </span>
                                    <h3 className="lp-book-card__title">
                                        <Link to={`/books/${id}`}>{book.title}</Link>
                                    </h3>
                                    <p className="lp-book-card__author">by {book.author}</p>
                                    <div className="lp-book-card__stars">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} style={{ color: s <= (book.rating || 5) ? '#f59e0b' : 'rgba(150,120,80,0.3)' }}>★</span>
                                        ))}
                                    </div>
                                    <p className="lp-book-card__excerpt">{book.excerpt}</p>
                                    <div className="lp-book-card__actions">
                                        <Link to={`/books/${id}`} className="lp-book-card__review">Read Review →</Link>
                                        {book.downloadLink && (
                                            <a href={book.downloadLink} target="_blank" rel="noreferrer" className="lp-book-card__dl">
                                                ⬇ PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lp-blogs__cta">
                    <Link to="/books" className="lp-hero__btn-secondary">
                        View All Books <BiRightArrowAlt />
                    </Link>
                </div>
            </section>

            {/*══════ TESTIMONIAL STRIP ══════*/}
            <section className="lp-testimonial">
                <div className="lp-testimonial__quote">
                    <p className="lp-testimonial__text">
                        "Ayona has an exceptional ability to break down the most complex mathematical
                        concepts into clear, understandable steps. Her patience and deep understanding
                        of the subject make her an outstanding tutor and researcher."
                    </p>
                    <div className="lp-testimonial__author">
                        <img src={Img1} alt="Professor" className="lp-testimonial__avatar" />
                        <div>
                            <div className="lp-testimonial__name">Dr. Ramesh Kumar</div>
                            <div className="lp-testimonial__role">Head of Department, Mathematics</div>
                        </div>
                    </div>
                </div>
            </section>

            {/*══════ CTA ══════*/}
            <section className="lp-cta" ref={ctaRef}>
                <div className="lp-cta__container">
                    <div className={`lp-cta__card reveal ${ctaVisible ? 'visible' : ''}`}>
                        <h2 className="lp-cta__title">Let's Work Together! 🤝</h2>
                        <p className="lp-cta__subtitle">
                            Whether you need math tutoring, help with a data project, or academic
                            writing support — I'm just a message away.
                        </p>
                        <div className="lp-cta__buttons">
                            <Link to="/contact" className="lp-hero__btn-primary">
                                <BiMessageSquareDetail /> Get in Touch
                            </Link>
                            <Link to="/portfolio" className="lp-hero__btn-secondary">
                                <BiCollection /> See My Work
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
