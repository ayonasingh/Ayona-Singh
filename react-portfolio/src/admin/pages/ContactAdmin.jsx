import React, { useEffect, useState } from 'react';
import { getContactInfo, updateContactInfo } from '../api';
import toast from 'react-hot-toast';
import { BiSave, BiMailSend, BiLogoWhatsapp, BiLogoLinkedin, BiLogoGithub, BiLogoInstagram, BiLink, BiMap, BiPhone } from 'react-icons/bi';

const ContactAdmin = () => {
    const [form, setForm] = useState({
        email: '',
        phone: '',
        whatsapp: '',
        linkedin: '',
        github: '',
        instagram: '',
        cvLink: '',
        location: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getContactInfo()
            .then((res) => setForm(res.data))
            .catch(() => toast.error('Failed to load contact info'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateContactInfo(form);
            toast.success('Contact info updated! ✨');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-spinner" />;

    const fields = [
        { key: 'email', label: 'Email Address', icon: <BiMailSend />, placeholder: 'your@email.com', type: 'email' },
        { key: 'phone', label: 'Phone / WhatsApp Display', icon: <BiPhone />, placeholder: '+91 XXXXXXXXXX', type: 'text' },
        { key: 'whatsapp', label: 'WhatsApp Number (digits only)', icon: <BiLogoWhatsapp />, placeholder: '91XXXXXXXXXX', type: 'text' },
        { key: 'location', label: 'Location', icon: <BiMap />, placeholder: 'New Delhi, India', type: 'text' },
        { key: 'cvLink', label: 'CV / Resume Link', icon: <BiLink />, placeholder: 'https://drive.google.com/...', type: 'url' },
        { key: 'linkedin', label: 'LinkedIn URL', icon: <BiLogoLinkedin />, placeholder: 'https://linkedin.com/in/...', type: 'url' },
        { key: 'github', label: 'GitHub URL', icon: <BiLogoGithub />, placeholder: 'https://github.com/...', type: 'url' },
        { key: 'instagram', label: 'Instagram URL', icon: <BiLogoInstagram />, placeholder: 'https://instagram.com/...', type: 'url' },
    ];

    return (
        <div>
            <div className="admin-page__header">
                <h1 className="admin-page__title">📞 Contact Info</h1>
                <p className="admin-page__subtitle">Manage your contact details, social links, and CV link shown on the website</p>
            </div>

            <form onSubmit={handleSave}>
                <div className="contact-admin-grid">
                    {fields.map(({ key, label, icon, placeholder, type }) => (
                        <div className="admin-card contact-admin-field" key={key}>
                            <div className="contact-admin-field__icon">{icon}</div>
                            <div style={{ flex: 1 }}>
                                <label className="admin-form__label">{label}</label>
                                <input
                                    className="admin-form__input"
                                    type={type}
                                    value={form[key] || ''}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    placeholder={placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Preview */}
                <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '1rem' }}>
                        Preview
                    </h2>
                    <div className="contact-preview">
                        <div className="contact-preview__item">
                            <BiMailSend className="contact-preview__icon" />
                            <span>{form.email || 'your@email.com'}</span>
                        </div>
                        <div className="contact-preview__item">
                            <BiPhone className="contact-preview__icon" />
                            <span>{form.phone || '+91 XXXXXXXXXX'}</span>
                        </div>
                        <div className="contact-preview__item">
                            <BiMap className="contact-preview__icon" />
                            <span>{form.location || 'New Delhi, India'}</span>
                        </div>
                        <div className="contact-preview__item">
                            <BiLogoLinkedin className="contact-preview__icon" />
                            <a href={form.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--admin-primary)', fontSize: '0.813rem' }}>
                                {form.linkedin || 'LinkedIn not set'}
                            </a>
                        </div>
                        <div className="contact-preview__item">
                            <BiLogoGithub className="contact-preview__icon" />
                            <a href={form.github} target="_blank" rel="noreferrer" style={{ color: 'var(--admin-primary)', fontSize: '0.813rem' }}>
                                {form.github || 'GitHub not set'}
                            </a>
                        </div>
                        {form.cvLink && (
                            <div className="contact-preview__item">
                                <BiLink className="contact-preview__icon" />
                                <a href={form.cvLink} target="_blank" rel="noreferrer" style={{ color: 'var(--admin-primary)', fontSize: '0.813rem' }}>
                                    CV / Resume →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                    <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                        <BiSave /> {saving ? 'Saving...' : 'Save Contact Info'}
                    </button>
                </div>
            </form>

            <style>{`
                .contact-admin-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                @media(max-width: 768px) { .contact-admin-grid { grid-template-columns: 1fr; } }
                .contact-admin-field {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }
                .contact-admin-field__icon {
                    font-size: 1.25rem;
                    color: var(--admin-primary);
                    margin-top: 1.85rem;
                    min-width: 1.25rem;
                }
                .contact-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 0.65rem;
                }
                .contact-preview__item {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    font-size: 0.875rem;
                    color: var(--admin-text);
                }
                .contact-preview__icon {
                    font-size: 1.1rem;
                    color: var(--admin-primary);
                    min-width: 1.1rem;
                }
            `}</style>
        </div>
    );
};

export default ContactAdmin;
