import React, { useEffect, useState } from 'react';
import { getPortfolio, createProject, updateProject, deleteProject, uploadImage } from '../api';
import toast from 'react-hot-toast';
import { BiImage, BiTrash, BiPlus, BiX, BiUpload, BiEdit, BiLink } from 'react-icons/bi';

const EMPTY_FORM = { title: '', description: '', image: '', link: '#' };

const PortfolioAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');

    const fetchProjects = () => {
        getPortfolio()
            .then((res) => setProjects(res.data))
            .catch(() => toast.error('Failed to load projects'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProjects(); }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setPreview('');
        setShowForm(true);
    };

    const openEdit = (proj) => {
        setEditId(proj.id);
        setForm({ title: proj.title || '', description: proj.description || '', image: proj.image || '', link: proj.link || '#' });
        setPreview(proj.image || '');
        setShowForm(true);
    };

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
            toast.success('Image uploaded!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title) return toast.error('Title is required');
        setSaving(true);
        try {
            if (editId) {
                await updateProject(editId, form);
                toast.success('Project updated!');
            } else {
                await createProject(form);
                toast.success('Project created!');
            }
            setShowForm(false);
            fetchProjects();
        } catch {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        setDeleting(id);
        try {
            await deleteProject(id);
            toast.success('Project deleted');
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch {
            toast.error('Delete failed');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div>
            <div className="admin-page__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="admin-page__title">🖼️ Portfolio Projects</h1>
                    <p className="admin-page__subtitle">Manage your academic and research projects</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                    <BiPlus /> New Project
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="admin-modal-backdrop">
                    <div className="admin-modal">
                        <div className="admin-modal__header">
                            <h2 className="admin-modal__title">{editId ? 'Edit Project' : 'New Project'}</h2>
                            <button className="admin-modal__close" onClick={() => setShowForm(false)}><BiX /></button>
                        </div>

                        <form onSubmit={handleSave} className="admin-modal__body">
                            <div className="admin-form__group">
                                <label className="admin-form__label">Project Image</label>
                                <div className="admin-upload-area">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                                    {uploading ? (
                                        <div className="admin-spinner" style={{ width: 30, height: 30, margin: '0.5rem auto' }} />
                                    ) : preview ? (
                                        <img src={preview} alt="preview" className="admin-upload-preview" />
                                    ) : (
                                        <>
                                            <BiUpload style={{ fontSize: '2rem', color: 'var(--admin-primary)', marginBottom: '0.5rem' }} />
                                            <p style={{ fontSize: '0.813rem', color: 'var(--admin-text-muted)' }}>Click to upload (max 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    className="admin-form__input"
                                    value={form.image}
                                    onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreview(e.target.value); }}
                                    placeholder="Or paste image URL"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Project Title *</label>
                                <input className="admin-form__input" value={form.title} required
                                    onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name..." />
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Description</label>
                                <textarea className="admin-form__textarea" value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe the project..." style={{ minHeight: '100px' }} />
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Demo Link</label>
                                <input className="admin-form__input" value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                                    {saving ? 'Saving...' : editId ? '💾 Update' : '✨ Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {loading ? (
                <div className="admin-spinner" />
            ) : projects.length === 0 ? (
                <div className="admin-card admin-empty">
                    <BiImage style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No projects yet. Create your first one!</p>
                </div>
            ) : (
                <div className="portfolio-admin-grid">
                    {projects.map((proj) => (
                        <div className="portfolio-admin-card" key={proj.id}>
                            <div className="portfolio-admin-card__img">
                                {proj.image ? (
                                    <img src={proj.image} alt={proj.title} />
                                ) : (
                                    <div className="portfolio-admin-card__img-placeholder">🖼️</div>
                                )}
                            </div>
                            <div className="portfolio-admin-card__body">
                                <h3 className="portfolio-admin-card__title">{proj.title}</h3>
                                <p className="portfolio-admin-card__desc">{proj.description}</p>
                                {proj.link && proj.link !== '#' && (
                                    <a href={proj.link} target="_blank" rel="noreferrer" className="portfolio-admin-card__link">
                                        <BiLink /> View Demo
                                    </a>
                                )}
                                <div className="portfolio-admin-card__actions">
                                    <button className="admin-btn admin-btn--secondary" onClick={() => openEdit(proj)}>
                                        <BiEdit /> Edit
                                    </button>
                                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(proj.id)} disabled={deleting === proj.id}>
                                        <BiTrash /> {deleting === proj.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .portfolio-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .portfolio-admin-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-card-border);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .portfolio-admin-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .portfolio-admin-card__img {
          height: 180px;
          overflow: hidden;
          background: hsl(250, 30%, 15%);
        }
        .portfolio-admin-card__img img { width: 100%; height: 100%; object-fit: cover; }
        .portfolio-admin-card__img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; opacity: 0.3;
        }
        .portfolio-admin-card__body { padding: 1.25rem; }
        .portfolio-admin-card__title {
          font-size: 0.938rem; font-weight: 600; color: var(--admin-text); margin-bottom: 0.5rem;
        }
        .portfolio-admin-card__desc {
          font-size: 0.813rem; color: var(--admin-text-muted); line-height: 1.5;
          margin-bottom: 0.75rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .portfolio-admin-card__link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.75rem; color: var(--admin-primary); margin-bottom: 0.75rem;
          text-decoration: none;
        }
        .portfolio-admin-card__actions { display: flex; gap: 0.5rem; }
        .portfolio-admin-card__actions .admin-btn { flex: 1; justify-content: center; font-size: 0.813rem; padding: 0.55rem 0.75rem; }
      `}</style>
        </div>
    );
};

export default PortfolioAdmin;
