import React, { useEffect, useState } from 'react';
import { getAbout, updateAbout, uploadImage, getQualification, updateQualification } from '../api';
import toast from 'react-hot-toast';
import { BiSave, BiUpload, BiPlus, BiTrash, BiBook, BiBriefcaseAlt, BiUser } from 'react-icons/bi';

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const TABS = [
    { id: 'about', label: 'About', icon: <BiUser /> },
    { id: 'education', label: 'Education', icon: <BiBook /> },
    { id: 'experience', label: 'Work Experience', icon: <BiBriefcaseAlt /> },
];

const emptyEntry = () => ({ id: genId(), title: '', institution: '', period: '' });

const AboutAdmin = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [form, setForm] = useState({ description: '', image: '', stats: [] });
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        Promise.all([getAbout(), getQualification()])
            .then(([aboutRes, qualRes]) => {
                setForm(aboutRes.data);
                setPreview(aboutRes.data.image || '');
                setEducation(qualRes.data.education || []);
                setExperience(qualRes.data.experience || []);
            })
            .catch(() => toast.error('Failed to load content'))
            .finally(() => setLoading(false));
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await uploadImage(fd);
            setForm((f) => ({ ...f, image: res.data.url }));
            setPreview(res.data.url);
            toast.success('Profile image uploaded!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const updateStat = (index, key, value) => {
        const newStats = [...(form.stats || [])];
        newStats[index] = { ...newStats[index], [key]: value };
        setForm({ ...form, stats: newStats });
    };

    const handleSaveAbout = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAbout(form);
            toast.success('About section updated! ✨');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    /* ── Education helpers ── */
    const addEducation = () => setEducation([...education, emptyEntry()]);
    const updateEducation = (idx, key, val) => {
        const arr = [...education];
        arr[idx] = { ...arr[idx], [key]: val };
        setEducation(arr);
    };
    const removeEducation = (idx) => setEducation(education.filter((_, i) => i !== idx));

    /* ── Experience helpers ── */
    const addExperience = () => setExperience([...experience, emptyEntry()]);
    const updateExperience = (idx, key, val) => {
        const arr = [...experience];
        arr[idx] = { ...arr[idx], [key]: val };
        setExperience(arr);
    };
    const removeExperience = (idx) => setExperience(experience.filter((_, i) => i !== idx));

    const handleSaveQualification = async () => {
        setSaving(true);
        try {
            await updateQualification({ education, experience });
            toast.success('Qualification data saved! 🎓');
        } catch {
            toast.error('Failed to save qualification');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-spinner" />;

    return (
        <div>
            <div className="admin-page__header">
                <h1 className="admin-page__title">👤 About & Qualification</h1>
                <p className="admin-page__subtitle">Manage your about section, education, and work experience</p>
            </div>

            {/* Tab Switcher */}
            <div className="about-admin-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`about-admin-tab ${activeTab === tab.id ? 'about-admin-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══════════════ ABOUT TAB ═══════════════ */}
            {activeTab === 'about' && (
                <form onSubmit={handleSaveAbout}>
                    <div className="admin-about-grid">
                        {/* Left: Image */}
                        <div className="admin-card">
                            <h2 className="admin-section-subtitle">Profile Photo</h2>
                            <div className="admin-upload-area" style={{ marginBottom: '1rem' }}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                {uploading ? (
                                    <div className="admin-spinner" style={{ width: 30, height: 30, margin: '1rem auto' }} />
                                ) : preview ? (
                                    <img src={preview} alt="profile" style={{
                                        width: '150px', height: '150px', borderRadius: '50%',
                                        objectFit: 'cover', border: '3px solid var(--admin-primary)',
                                        margin: '0 auto', display: 'block'
                                    }} />
                                ) : (
                                    <>
                                        <BiUpload style={{ fontSize: '2.5rem', color: 'var(--admin-primary)', marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: '0.813rem', color: 'var(--admin-text-muted)' }}>Upload profile photo</p>
                                    </>
                                )}
                            </div>
                            <input
                                className="admin-form__input"
                                value={form.image || ''}
                                onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreview(e.target.value); }}
                                placeholder="Or paste image URL"
                            />
                        </div>

                        {/* Right: Description */}
                        <div className="admin-card">
                            <h2 className="admin-section-subtitle">Bio Description</h2>
                            <div className="admin-form__group">
                                <textarea
                                    className="admin-form__textarea"
                                    value={form.description || ''}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Write your about me description..."
                                    style={{ minHeight: '220px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    {form.stats && form.stats.length > 0 && (
                        <div className="admin-card" style={{ marginTop: '1rem' }}>
                            <h2 className="admin-section-subtitle" style={{ marginBottom: '1.25rem' }}>Info Boxes (Stats)</h2>
                            <div className="admin-stats-grid">
                                {form.stats.map((stat, i) => (
                                    <div className="admin-stat-box" key={stat.id}>
                                        <div className="admin-form__group">
                                            <label className="admin-form__label">Title</label>
                                            <input className="admin-form__input" value={stat.title}
                                                onChange={(e) => updateStat(i, 'title', e.target.value)} />
                                        </div>
                                        <div className="admin-form__group">
                                            <label className="admin-form__label">Subtitle</label>
                                            <input className="admin-form__input" value={stat.subtitle}
                                                onChange={(e) => updateStat(i, 'subtitle', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1.25rem' }}>
                        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                            <BiSave /> {saving ? 'Saving...' : 'Save About Section'}
                        </button>
                    </div>
                </form>
            )}

            {/* ═══════════════ EDUCATION TAB ═══════════════ */}
            {activeTab === 'education' && (
                <div>
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="admin-section-subtitle" style={{ margin: 0 }}>Education Entries</h2>
                            <button type="button" className="admin-btn admin-btn--secondary" onClick={addEducation}>
                                <BiPlus /> Add Education
                            </button>
                        </div>

                        {education.length === 0 && (
                            <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                                No education entries yet. Click "Add Education" to start.
                            </p>
                        )}

                        {education.map((item, idx) => (
                            <div className="qual-entry-card" key={item.id}>
                                <div className="qual-entry-number">{idx + 1}</div>
                                <div className="qual-entry-fields">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Degree / Title</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.title}
                                            onChange={(e) => updateEducation(idx, 'title', e.target.value)}
                                            placeholder="e.g. B.Sc. Mathematics (Hons.)"
                                        />
                                    </div>
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Institution / School</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.institution}
                                            onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                            placeholder="e.g. University - India"
                                        />
                                    </div>
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Period</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.period}
                                            onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                                            placeholder="e.g. 2020 - 2022"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--danger qual-entry-delete"
                                    onClick={() => removeEducation(idx)}
                                    title="Delete"
                                >
                                    <BiTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                        <button className="admin-btn admin-btn--primary" onClick={handleSaveQualification} disabled={saving}>
                            <BiSave /> {saving ? 'Saving...' : 'Save Education'}
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════ WORK EXPERIENCE TAB ═══════════════ */}
            {activeTab === 'experience' && (
                <div>
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="admin-section-subtitle" style={{ margin: 0 }}>Work Experience Entries</h2>
                            <button type="button" className="admin-btn admin-btn--secondary" onClick={addExperience}>
                                <BiPlus /> Add Experience
                            </button>
                        </div>

                        {experience.length === 0 && (
                            <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                                No work experience entries yet. Click "Add Experience" to start.
                            </p>
                        )}

                        {experience.map((item, idx) => (
                            <div className="qual-entry-card" key={item.id}>
                                <div className="qual-entry-number">{idx + 1}</div>
                                <div className="qual-entry-fields">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Job Title / Role</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.title}
                                            onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                                            placeholder="e.g. Math Tutor"
                                        />
                                    </div>
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Company / Organisation</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.institution}
                                            onChange={(e) => updateExperience(idx, 'institution', e.target.value)}
                                            placeholder="e.g. Private Coaching - India"
                                        />
                                    </div>
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Period</label>
                                        <input
                                            className="admin-form__input"
                                            value={item.period}
                                            onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                                            placeholder="e.g. 2023 - Present"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--danger qual-entry-delete"
                                    onClick={() => removeExperience(idx)}
                                    title="Delete"
                                >
                                    <BiTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                        <button className="admin-btn admin-btn--primary" onClick={handleSaveQualification} disabled={saving}>
                            <BiSave /> {saving ? 'Saving...' : 'Save Work Experience'}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .about-admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--admin-card-border);
          padding-bottom: 0;
        }
        .about-admin-tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          border: none;
          background: transparent;
          color: var(--admin-text-muted);
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          margin-bottom: -1px;
        }
        .about-admin-tab:hover { color: var(--admin-text); }
        .about-admin-tab--active {
          color: var(--admin-primary) !important;
          border-bottom-color: var(--admin-primary);
        }
        .admin-about-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1rem;
        }
        @media(max-width: 768px) { .admin-about-grid { grid-template-columns: 1fr; } }
        .admin-section-subtitle {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text);
          margin-bottom: 1rem;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media(max-width: 768px) { .admin-stats-grid { grid-template-columns: 1fr; } }
        .admin-stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--admin-card-border);
          border-radius: 0.75rem;
          padding: 1rem;
        }
        .qual-entry-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--admin-card-border);
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }
        .qual-entry-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          min-width: 32px;
          background: var(--admin-primary);
          color: #fff;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        .qual-entry-fields {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        @media(max-width: 768px) { .qual-entry-fields { grid-template-columns: 1fr; } }
        .qual-entry-delete {
          padding: 0.5rem !important;
          min-width: unset !important;
          margin-top: 0.25rem;
        }
        .admin-btn--danger {
          background: rgba(239,68,68,0.15) !important;
          color: #f87171 !important;
          border: 1px solid rgba(239,68,68,0.3) !important;
        }
        .admin-btn--danger:hover {
          background: rgba(239,68,68,0.25) !important;
        }
        .admin-btn--secondary {
          background: rgba(255,255,255,0.07) !important;
          color: var(--admin-text) !important;
          border: 1px solid var(--admin-card-border) !important;
        }
        .admin-btn--secondary:hover {
          background: rgba(255,255,255,0.12) !important;
        }
      `}</style>
        </div>
    );
};

export default AboutAdmin;
