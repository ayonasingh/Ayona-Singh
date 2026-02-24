import React, { useEffect, useState } from 'react';
import { getHome, updateHome, uploadImage } from '../api';
import toast from 'react-hot-toast';
import { BiSave, BiUpload, BiUser } from 'react-icons/bi';

const HomeAdmin = () => {
    const [form, setForm] = useState({ name: '', subtitle: '', description: '', profileImage: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        getHome()
            .then((res) => {
                setForm(res.data);
                setPreview(res.data.profileImage || '');
            })
            .catch(() => toast.error('Failed to load home content'))
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
            setForm((f) => ({ ...f, profileImage: res.data.url }));
            setPreview(res.data.url);
            toast.success('Profile photo uploaded to Cloudinary! ☁️');
        } catch (err) {
            toast.error('Upload failed: ' + (err?.response?.data?.error || err.message));
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateHome(form);
            toast.success('Home content updated! ✨');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-spinner" />;

    return (
        <div>
            <div className="admin-page__header">
                <h1 className="admin-page__title">🏠 Home Section</h1>
                <p className="admin-page__subtitle">Edit the hero section content and profile photo</p>
            </div>

            <div className="admin-card" style={{ maxWidth: 720 }}>
                <form onSubmit={handleSave}>

                    {/* ── Profile Photo Upload ── */}
                    <div className="admin-form__group">
                        <label className="admin-form__label">
                            <BiUser style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Profile / Hero Photo
                        </label>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {/* Preview */}
                            <div style={{
                                width: 110, height: 110, borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, hsl(250,69%,25%), hsl(250,69%,45%))',
                                overflow: 'hidden', border: '3px solid var(--admin-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}>
                                {preview
                                    ? <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <BiUser style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.4)' }} />
                                }
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="admin-upload-area" style={{ minHeight: 80, position: 'relative' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                    />
                                    {uploading ? (
                                        <>
                                            <div className="admin-spinner" style={{ width: 24, height: 24 }} />
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--admin-text-muted)' }}>
                                                Uploading to Cloudinary…
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <BiUpload style={{ fontSize: '1.8rem', color: 'var(--admin-primary)' }} />
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--admin-text-muted)' }}>
                                                Click to upload profile photo (JPG, PNG, WebP — max 10 MB)
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', opacity: 0.7 }}>
                                                ☁️ Stored on Cloudinary CDN
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    className="admin-form__input"
                                    value={form.profileImage || ''}
                                    onChange={(e) => {
                                        setForm({ ...form, profileImage: e.target.value });
                                        setPreview(e.target.value);
                                    }}
                                    placeholder="Or paste image URL directly"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Name ── */}
                    <div className="admin-form__group">
                        <label className="admin-form__label">Your Name</label>
                        <input
                            className="admin-form__input"
                            value={form.name || ''}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Ayona Singh"
                        />
                    </div>

                    {/* ── Subtitle ── */}
                    <div className="admin-form__group">
                        <label className="admin-form__label">Subtitle / Role</label>
                        <input
                            className="admin-form__input"
                            value={form.subtitle || ''}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            placeholder="e.g. Mathematics Student"
                        />
                    </div>

                    {/* ── Description ── */}
                    <div className="admin-form__group">
                        <label className="admin-form__label">Hero Description</label>
                        <textarea
                            className="admin-form__textarea"
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Short description about yourself..."
                            style={{ minHeight: '140px' }}
                        />
                    </div>

                    {/* ── Preview ── */}
                    <div className="admin-form__preview">
                        <p className="admin-form__label" style={{ marginBottom: '0.75rem' }}>Preview</p>
                        <div className="home-preview">
                            {preview && (
                                <img src={preview} alt="Profile" style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    objectFit: 'cover', marginBottom: '0.75rem',
                                    border: '2px solid var(--admin-primary)',
                                }} />
                            )}
                            <h1 className="home-preview__name">{form.name || 'Your Name'}</h1>
                            <h3 className="home-preview__subtitle">{form.subtitle || 'Your Role'}</h3>
                            <p className="home-preview__desc">{form.description || 'Your description...'}</p>
                        </div>
                    </div>

                    <button type="submit" className="admin-btn admin-btn--primary" disabled={saving} style={{ marginTop: '1rem' }}>
                        <BiSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <style>{`
        .home-preview {
          background: rgba(255,255,255,0.03);
          border: 1px dashed var(--admin-card-border);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        .home-preview__name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--admin-primary);
          margin-bottom: 0.25rem;
        }
        .home-preview__subtitle {
          font-size: 1rem;
          color: var(--admin-text);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .home-preview__desc {
          font-size: 0.875rem;
          color: var(--admin-text-muted);
          line-height: 1.6;
        }
        .admin-upload-area {
          position: relative;
          border: 2px dashed var(--admin-border);
          border-radius: 0.75rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          min-height: 100px;
        }
        .admin-upload-area:hover {
          border-color: var(--admin-primary);
          background: rgba(109,40,217,0.05);
        }
      `}</style>
        </div>
    );
};

export default HomeAdmin;
