import React, { useState, useEffect } from 'react';
import './ContactPageNew.css';
import {
    BiMailSend, BiLogoWhatsapp, BiLogoLinkedin, BiLogoGithub,
    BiLogoInstagram, BiSend, BiMap, BiTime, BiChevronRight,
    BiPhone, BiCheck
} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { sendContact, getContactInfo } from '../admin/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [focused, setFocused] = useState('');
    const [contactInfo, setContactInfo] = useState({
        email: 'ayona.singh@email.com',
        phone: '+91 9999999999',
        whatsapp: '919999999999',
        linkedin: 'https://www.linkedin.com/in/ayona-singh-10b5561b8/',
        github: 'https://github.com/',
        instagram: 'https://www.instagram.com/',
        location: 'New Delhi, India',
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        getContactInfo()
            .then(res => setContactInfo(prev => ({ ...prev, ...res.data })))
            .catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            return toast.error('Please fill in all required fields');
        }
        setSending(true);
        try {
            await sendContact(form);
            setSent(true);
            toast.success("Message sent! I'll get back to you soon ✨");
            setForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSent(false), 5000);
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const SOCIAL_LINKS = [
        { icon: <BiLogoLinkedin />, label: 'LinkedIn', href: contactInfo.linkedin, color: '#0077b5' },
        { icon: <BiLogoGithub />, label: 'GitHub', href: contactInfo.github || 'https://github.com/', color: '#333' },
        { icon: <BiLogoInstagram />, label: 'Instagram', href: contactInfo.instagram || 'https://instagram.com/', color: '#e1306c' },
        { icon: <BiLogoWhatsapp />, label: 'WhatsApp', href: `https://wa.me/${contactInfo.whatsapp}`, color: '#25d366' },
    ];

    return (
        <div className="ctp-wrapper">
            {/* ── Hero ── */}
            <section className="ctp-hero">
                <div className="ctp-hero__orb ctp-hero__orb--1" />
                <div className="ctp-hero__orb ctp-hero__orb--2" />
                <div className="ctp-hero__orb ctp-hero__orb--3" />
                <div className="ctp-hero__content">
                    <nav className="ctp-breadcrumb">
                        <Link to="/">Home</Link> <BiChevronRight /> <span>Contact</span>
                    </nav>
                    <div className="ctp-hero__tag">Let's Connect</div>
                    <h1 className="ctp-hero__title">Get In <span>Touch</span></h1>
                    <p className="ctp-hero__sub">
                        Have a question, collaboration idea, or just want to say hello?<br />
                        I'd love to hear from you — drop me a message!
                    </p>
                </div>
                {/* Decorative floating emojis */}
                <div className="ctp-hero__floats" aria-hidden>
                    <span>💬</span><span>✉️</span><span>🤝</span><span>💡</span>
                </div>
            </section>

            {/* ── Contact Info Cards ── */}
            <section className="ctp-info-strip">
                <div className="ctp-info-strip__inner">
                    <div className="ctp-info-card">
                        <div className="ctp-info-card__icon" style={{ '--ic': '#7c6ff7' }}><BiMailSend /></div>
                        <div className="ctp-info-card__body">
                            <span className="ctp-info-card__label">Email</span>
                            <a href={`mailto:${contactInfo.email}`} className="ctp-info-card__value">{contactInfo.email}</a>
                        </div>
                    </div>
                    <div className="ctp-info-card">
                        <div className="ctp-info-card__icon" style={{ '--ic': '#25d366' }}><BiLogoWhatsapp /></div>
                        <div className="ctp-info-card__body">
                            <span className="ctp-info-card__label">WhatsApp</span>
                            <a href={`https://wa.me/${contactInfo.whatsapp}`} className="ctp-info-card__value">{contactInfo.phone}</a>
                        </div>
                    </div>
                    <div className="ctp-info-card">
                        <div className="ctp-info-card__icon" style={{ '--ic': '#0077b5' }}><BiLogoLinkedin /></div>
                        <div className="ctp-info-card__body">
                            <span className="ctp-info-card__label">LinkedIn</span>
                            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="ctp-info-card__value">Connect with me</a>
                        </div>
                    </div>
                    {contactInfo.location && (
                        <div className="ctp-info-card">
                            <div className="ctp-info-card__icon" style={{ '--ic': '#ec4899' }}><BiMap /></div>
                            <div className="ctp-info-card__body">
                                <span className="ctp-info-card__label">Location</span>
                                <span className="ctp-info-card__value">{contactInfo.location}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Main Grid ── */}
            <div className="ctp-main">
                {/* Left Column */}
                <div className="ctp-left">
                    {/* Availability */}
                    <div className="ctp-availability">
                        <div className="ctp-availability__dot" />
                        <div>
                            <p className="ctp-availability__title">Currently Available</p>
                            <p className="ctp-availability__sub">for tutoring, collaborations &amp; freelance projects</p>
                        </div>
                    </div>

                    {/* Response info */}
                    <div className="ctp-resp-box">
                        <BiTime className="ctp-resp-box__icon" />
                        <div>
                            <p className="ctp-resp-box__title">Quick Response</p>
                            <p className="ctp-resp-box__text">I typically reply within <strong>24 hours</strong> on weekdays.</p>
                        </div>
                    </div>

                    {/* What can I help with */}
                    <div className="ctp-help-box">
                        <h3 className="ctp-help-box__title">What can I help with?</h3>
                        <ul className="ctp-help-list">
                            {['Math Tutoring (JEE, Olympiad, College)', 'Data Analysis & Research Projects', 'Academic Writing & LaTeX', 'Python / MATLAB Scripting', 'Collaborations & Research', 'General Questions'].map(item => (
                                <li key={item}><BiCheck className="ctp-help-list__check" />{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Social links */}
                    <div className="ctp-socials">
                        <p className="ctp-socials__title">Find me on</p>
                        <div className="ctp-socials__grid">
                            {SOCIAL_LINKS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ctp-social-btn"
                                    style={{ '--sc': s.color }}
                                    title={s.label}
                                >
                                    {s.icon}
                                    <span>{s.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column — Form */}
                <div className="ctp-form-wrap">
                    <div className="ctp-form-card">
                        <div className="ctp-form-card__header">
                            <h2 className="ctp-form-card__title">Send a Message</h2>
                            <p className="ctp-form-card__sub">I'll get back to you as soon as possible.</p>
                        </div>

                        {sent ? (
                            <div className="ctp-success">
                                <div className="ctp-success__icon">✅</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. I'll reply within 24 hours.</p>
                            </div>
                        ) : (
                            <form className="ctp-form" onSubmit={handleSubmit} noValidate>
                                <div className="ctp-form__row">
                                    <div className={`ctp-field${focused === 'name' || form.name ? ' ctp-field--active' : ''}`}>
                                        <label className="ctp-field__label" htmlFor="ct-name">Your Name *</label>
                                        <input
                                            id="ct-name"
                                            type="text"
                                            name="name"
                                            className="ctp-field__input"
                                            placeholder="Ayona Singh"
                                            value={form.name}
                                            onChange={onChange}
                                            onFocus={() => setFocused('name')}
                                            onBlur={() => setFocused('')}
                                            required
                                        />
                                    </div>
                                    <div className={`ctp-field${focused === 'email' || form.email ? ' ctp-field--active' : ''}`}>
                                        <label className="ctp-field__label" htmlFor="ct-email">Email Address *</label>
                                        <input
                                            id="ct-email"
                                            type="email"
                                            name="email"
                                            className="ctp-field__input"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={onChange}
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused('')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={`ctp-field${focused === 'subject' || form.subject ? ' ctp-field--active' : ''}`}>
                                    <label className="ctp-field__label" htmlFor="ct-subject">Subject</label>
                                    <input
                                        id="ct-subject"
                                        type="text"
                                        name="subject"
                                        className="ctp-field__input"
                                        placeholder="What's this about?"
                                        value={form.subject}
                                        onChange={onChange}
                                        onFocus={() => setFocused('subject')}
                                        onBlur={() => setFocused('')}
                                    />
                                </div>

                                <div className={`ctp-field${focused === 'message' || form.message ? ' ctp-field--active' : ''}`}>
                                    <label className="ctp-field__label" htmlFor="ct-message">Message *</label>
                                    <textarea
                                        id="ct-message"
                                        name="message"
                                        rows="6"
                                        className="ctp-field__input ctp-field__input--textarea"
                                        placeholder="Write your message here…"
                                        value={form.message}
                                        onChange={onChange}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused('')}
                                        required
                                    />
                                    <span className="ctp-field__char-count">{form.message.length} characters</span>
                                </div>

                                <button type="submit" className="ctp-submit-btn" disabled={sending}>
                                    {sending ? (
                                        <><span className="ctp-btn-spinner" /> Sending…</>
                                    ) : (
                                        <><BiSend /> Send Message</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
