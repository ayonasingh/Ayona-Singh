import React, { useEffect, useState } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog, uploadImage } from '../api';
import toast from 'react-hot-toast';
import { BiEdit, BiTrash, BiPlus, BiX, BiUpload, BiCalendar, BiTime } from 'react-icons/bi';

const EMPTY_FORM = {
    tag: '', date: '', readTime: '', title: '', excerpt: '', content: '', image: '', link: '#',
};

const BlogsAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');

    const fetchBlogs = () => {
        getBlogs()
            .then((res) => setBlogs(res.data))
            .catch(() => toast.error('Failed to load blogs'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBlogs(); }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setPreview('');
        setShowForm(true);
    };

    const openEdit = (blog) => {
        setEditId(blog.id || blog._id);
        setForm({
            tag: blog.tag || '',
            date: blog.date || '',
            readTime: blog.readTime || '',
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            image: blog.image || '',
            link: blog.link || '#',
        });
        setPreview(blog.image || '');
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
        if (!form.title || !form.excerpt) return toast.error('Title and excerpt are required');
        setSaving(true);
        try {
            if (editId) {
                await updateBlog(editId, form);
                toast.success('Blog updated!');
            } else {
                await createBlog(form);
                toast.success('Blog created!');
            }
            setShowForm(false);
            fetchBlogs();
        } catch {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await deleteBlog(id);
            toast.success('Blog deleted');
            setBlogs((prev) => prev.filter((b) => b.id !== id));
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
                    <h1 className="admin-page__title">📝 Blog Posts</h1>
                    <p className="admin-page__subtitle">Create and manage your blog articles</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                    <BiPlus /> New Blog
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="admin-modal-backdrop">
                    <div className="admin-modal">
                        <div className="admin-modal__header">
                            <h2 className="admin-modal__title">{editId ? 'Edit Blog' : 'New Blog Post'}</h2>
                            <button className="admin-modal__close" onClick={() => setShowForm(false)}><BiX /></button>
                        </div>

                        <form onSubmit={handleSave} className="admin-modal__body">
                            {/* Image Upload */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">Cover Image</label>
                                <div className="admin-upload-area">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                                    {uploading ? (
                                        <div className="admin-spinner" style={{ width: 30, height: 30, margin: '0.5rem auto' }} />
                                    ) : preview ? (
                                        <img src={preview} alt="preview" className="admin-upload-preview" />
                                    ) : (
                                        <>
                                            <BiUpload style={{ fontSize: '2rem', color: 'var(--admin-primary)', marginBottom: '0.5rem' }} />
                                            <p style={{ fontSize: '0.813rem', color: 'var(--admin-text-muted)' }}>
                                                Click to upload an image (max 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                {form.image && (
                                    <input
                                        className="admin-form__input"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        placeholder="Or paste image URL"
                                        style={{ marginTop: '0.5rem' }}
                                    />
                                )}
                            </div>

                            <div className="admin-grid-2">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Tag / Category</label>
                                    <input className="admin-form__input" value={form.tag}
                                        onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Calculus" />
                                </div>
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Date</label>
                                    <input className="admin-form__input" value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Feb 10, 2026" />
                                </div>
                            </div>

                            <div className="admin-grid-2">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Read Time</label>
                                    <input className="admin-form__input" value={form.readTime}
                                        onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="e.g. 5 min read" />
                                </div>
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Link / URL</label>
                                    <input className="admin-form__input" value={form.link}
                                        onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="#" />
                                </div>
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Title *</label>
                                <input className="admin-form__input" value={form.title} required
                                    onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog title..." />
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Excerpt *</label>
                                <textarea className="admin-form__textarea" value={form.excerpt} required
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="Short summary of the blog post (shown on cards)..." />
                            </div>

                            <div className="admin-form__group">
                                <label className="admin-form__label">Full Article Content</label>
                                <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                                    Write the full article below. Use <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3 }}>## Heading</code> for sections,
                                    <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3, marginLeft: 4 }}>**bold**</code>,
                                    <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3, marginLeft: 4 }}>- list items</code>, and
                                    <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3, marginLeft: 4 }}>```code```</code>.
                                </p>
                                <textarea
                                    className="admin-form__textarea"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write the full blog article here...&#10;&#10;## Introduction&#10;...&#10;&#10;## Section 1&#10;"
                                    style={{ minHeight: '240px', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                                    {saving ? 'Saving...' : editId ? '💾 Update Blog' : '✨ Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blogs List */}
            {loading ? (
                <div className="admin-spinner" />
            ) : blogs.length === 0 ? (
                <div className="admin-card admin-empty">
                    <BiEdit style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No blog posts yet. Create your first one!</p>
                </div>
            ) : (
                <div className="blogs-admin-grid">
                    {blogs.map((blog) => (
                        <div className="blogs-admin-card" key={blog.id}>
                            <div className="blogs-admin-card__img">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} />
                                ) : (
                                    <div className="blogs-admin-card__img-placeholder">📝</div>
                                )}
                                <span className="blogs-admin-card__tag">{blog.tag || 'No tag'}</span>
                            </div>
                            <div className="blogs-admin-card__body">
                                <h3 className="blogs-admin-card__title">{blog.title}</h3>
                                <p className="blogs-admin-card__excerpt">{blog.excerpt}</p>
                                <div className="blogs-admin-card__meta">
                                    <span><BiCalendar /> {blog.date}</span>
                                    <span><BiTime /> {blog.readTime}</span>
                                </div>
                                <div className="blogs-admin-card__actions">
                                    <button className="admin-btn admin-btn--secondary" onClick={() => openEdit(blog)}>
                                        <BiEdit /> Edit
                                    </button>
                                    <button
                                        className="admin-btn admin-btn--danger"
                                        onClick={() => handleDelete(blog.id)}
                                        disabled={deleting === blog.id}
                                    >
                                        <BiTrash /> {deleting === blog.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .blogs-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .blogs-admin-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-card-border);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .blogs-admin-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .blogs-admin-card__img {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: hsl(250, 30%, 15%);
        }
        .blogs-admin-card__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blogs-admin-card__img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          opacity: 0.3;
        }
        .blogs-admin-card__tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--admin-primary);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 99px;
        }
        .blogs-admin-card__body { padding: 1.25rem; }
        .blogs-admin-card__title {
          font-size: 0.938rem;
          font-weight: 600;
          color: var(--admin-text);
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogs-admin-card__excerpt {
          font-size: 0.813rem;
          color: var(--admin-text-muted);
          line-height: 1.5;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogs-admin-card__meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin-bottom: 0.75rem;
        }
        .blogs-admin-card__meta span { display: flex; align-items: center; gap: 0.3rem; }
        .blogs-admin-card__actions { display: flex; gap: 0.5rem; }
        .blogs-admin-card__actions .admin-btn { flex: 1; justify-content: center; font-size: 0.813rem; padding: 0.55rem 0.75rem; }
      `}</style>
        </div>
    );
};

export default BlogsAdmin;
