import React, { useEffect, useState } from 'react';
import { getHome, updateHome } from '../api';
import toast from 'react-hot-toast';
import { BiSave } from 'react-icons/bi';

const HomeAdmin = () => {
    const [form, setForm] = useState({ name: '', subtitle: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getHome()
            .then((res) => setForm(res.data))
            .catch(() => toast.error('Failed to load home content'))
            .finally(() => setLoading(false));
    }, []);

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
                <p className="admin-page__subtitle">Edit the hero section content</p>
            </div>

            <div className="admin-card" style={{ maxWidth: 680 }}>
                <form onSubmit={handleSave}>
                    <div className="admin-form__group">
                        <label className="admin-form__label">Your Name</label>
                        <input
                            className="admin-form__input"
                            value={form.name || ''}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Ayona Singh"
                        />
                    </div>

                    <div className="admin-form__group">
                        <label className="admin-form__label">Subtitle / Role</label>
                        <input
                            className="admin-form__input"
                            value={form.subtitle || ''}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            placeholder="e.g. Mathematics Student"
                        />
                    </div>

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

                    <div className="admin-form__preview">
                        <p className="admin-form__label" style={{ marginBottom: '0.75rem' }}>Preview</p>
                        <div className="home-preview">
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
      `}</style>
        </div>
    );
};

export default HomeAdmin;
