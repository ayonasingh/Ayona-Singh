import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import '../pages/pages.css';

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

/* ── Typing animation hook ── */
const TYPED_STRINGS = [
    'Mathematics Student',
    'Data Analyst',
    'Math Tutor',
    'Problem Solver',
    'Research Enthusiast',
];

function useTyping() {
    const [display, setDisplay] = useState('');
    const [index, setIndex] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = TYPED_STRINGS[index];
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
                    setIndex(i => (i + 1) % TYPED_STRINGS.length);
                    setCharIdx(0);
                } else {
                    setCharIdx(c => c - 1);
                }
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [charIdx, deleting, index]);

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
function useReveal(delay = 0) {
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

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const HomePage = () => {
    const typed = useTyping();

    /* Stats reveal */
    const [statsRef, statsVisible] = useReveal();

    /* Reveal refs */
    const [whatRef, whatVisible] = useReveal();
    const [skillRef, skillVisible] = useReveal();
    const [blogRef, blogVisible] = useReveal();
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
                            <span>Ayona Singh</span>
                        </h1>

                        <div className="lp-hero__typed-wrap">
                            <span className="lp-hero__typed">{typed}</span>
                            <span className="lp-hero__cursor" />
                        </div>

                        <p className="lp-hero__description">
                            A passionate Mathematics student with a strong foundation in Calculus,
                            Statistics, Linear Algebra &amp; Mathematical Modelling. I love solving
                            complex problems and applying mathematical reasoning to real-world
                            challenges.
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
                            <a href="https://www.linkedin.com/in/ayona-singh-10b5561b8/" className="lp-hero__social-link" target="_blank" rel="noreferrer">
                                <BiLogoLinkedin />
                            </a>
                            <a href="https://github.com/" className="lp-hero__social-link" target="_blank" rel="noreferrer">
                                <BiLogoGithub />
                            </a>
                            <a href="https://www.instagram.com/" className="lp-hero__social-link" target="_blank" rel="noreferrer">
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
                            <SkillBar name="Calculus" pct={90} />
                            <SkillBar name="Linear Algebra" pct={85} />
                            <SkillBar name="Statistics" pct={80} />
                            <SkillBar name="Python" pct={72} />
                            <SkillBar name="MATLAB" pct={60} />
                            <SkillBar name="LaTeX" pct={75} />
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
                    {BLOG_PREVIEWS.map((b, i) => (
                        <div
                            key={i}
                            className={`lp-blog-card reveal ${blogVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.12}s` }}
                        >
                            <div className="lp-blog-card__img-wrap">
                                <img src={b.img} alt={b.title} className="lp-blog-card__img" />
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
                                    <Link to="/blogs" className="lp-blog-card__link">
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
