import React, { useState } from 'react';
import "./Contact.css";
import { BiMailSend, BiRightArrowAlt, BiLogoWhatsapp, BiLogoLinkedin, BiSend } from "react-icons/bi";
import { sendContact } from '../../admin/api';
import toast from 'react-hot-toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            return toast.error('Please fill in all required fields');
        }
        setSending(true);
        try {
            await sendContact(form);
            toast.success('Message sent! I\'ll get back to you soon ✨');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="contact section" id="contact">
            <h2 className="section__title">Get in touch</h2>
            <span className="section__subtitle">Contact Me</span>

            <div className="contact__container container grid">
                <div className="contact__content">
                    <h3 className="contact__title">Talk to me</h3>

                    <div className="contact__info">
                        <div className="contact__card">
                            <BiMailSend className="contact__card-icon" />
                            <h3 className="contact__card-title">Email</h3>
                            <span className="contact__card-data">ayona.singh@email.com</span>
                            <a href="mailto:ayona.singh@email.com" className="contact__button">Write me <BiRightArrowAlt className="contact__button-icon" /></a>
                        </div>

                        <div className="contact__card">
                            <BiLogoWhatsapp className="contact__card-icon" />
                            <h3 className="contact__card-title">WhatsApp</h3>
                            <span className="contact__card-data">+91 XXXXXXXXXX</span>
                            <a href="https://api.whatsapp.com/send?phone=91XXXXXXXXXX&text=Hello, Ayona!" className="contact__button">Write me <BiRightArrowAlt className="contact__button-icon" /></a>
                        </div>

                        <div className="contact__card">
                            <BiLogoLinkedin className="contact__card-icon" />
                            <h3 className="contact__card-title">LinkedIn</h3>
                            <span className="contact__card-data">ayona-singh</span>
                            <a href="https://www.linkedin.com/in/ayona-singh-10b5561b8/" className="contact__button" target="_blank" rel="noreferrer">Connect <BiRightArrowAlt className="contact__button-icon" /></a>
                        </div>
                    </div>
                </div>

                <div className="contact__content">
                    <h3 className="contact__title">Write me a message</h3>

                    <form className="contact__form" onSubmit={handleSubmit}>
                        <div className="contact__form-div">
                            <label className="contact__form-tag">Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="contact__form-input"
                                placeholder="Insert your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="contact__form-div">
                            <label className="contact__form-tag">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="contact__form-input"
                                placeholder="Insert your email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="contact__form-div">
                            <label className="contact__form-tag">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="contact__form-input"
                                placeholder="Message subject"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            />
                        </div>

                        <div className="contact__form-div contact__form-area">
                            <label className="contact__form-tag">Message *</label>
                            <textarea
                                name="message"
                                cols="30"
                                rows="10"
                                className="contact__form-input"
                                placeholder="Write your message"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button className="button button--flex" type="submit" disabled={sending}>
                            {sending ? 'Sending...' : 'Send Message'}
                            <BiSend className="button__icon" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact;
