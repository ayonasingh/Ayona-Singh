import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook, uploadImage } from '../api';
import toast from 'react-hot-toast';
import {
    BiBook, BiPlus, BiX, BiEdit, BiTrash, BiUpload,
    BiDownload, BiToggleLeft, BiToggleRight,
} from 'react-icons/bi';

const STARS = [1, 2, 3, 4, 5];

const GENRE_OPTIONS = [
    'Mathematics',
    'Statistics',
    'Biography',
    'Psychology & Probability',
    'Mathematics History',
    'Python & Data Science',
    'Self Help',
    'Productivity',
    'Science',
    'Philosophy',
    'Technology',
    'Other',
];

const EMPTY_FORM = {
    title: '', author: '', genre: '', rating: 5, coverImage: '',
    excerpt: '', review: '', downloadLink: '', publishedYear: '',
    readDate: '', pageCount: '', language: 'English', featured: false,
};

const BooksAdmin = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');
    const [customGenre, setCustomGenre] = useState(false);

    const fetchBooks = () =>
        getBooks()
            .then(r => setBooks(r.data))
            .catch((err) => toast.error('Failed to load books: ' + (err?.response?.data?.error || err.message)))
            .finally(() => setLoading(false));

    useEffect(() => { fetchBooks(); }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setPreview('');
        setCustomGenre(false);
        setShowForm(true);
    };

    const openEdit = (b) => {
        setEditId(b._id || b.id);
        const genre = b.genre || '';
        setCustomGenre(!GENRE_OPTIONS.includes(genre));
        setForm({
            title: b.title || '',
            author: b.author || '',
            genre,
            rating: b.rating ?? 5,
            coverImage: b.coverImage || '',
            excerpt: b.excerpt || '',
            review: b.review || '',
            downloadLink: b.downloadLink || '',
            publishedYear: b.publishedYear || '',
            readDate: b.readDate || '',
            pageCount: b.pageCount || '',
            language: b.language || 'English',
            featured: b.featured ?? false,
        });
        setPreview(b.coverImage || '');
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
            setForm(prev => ({ ...prev, coverImage: res.data.url }));
            setPreview(res.data.url);
            toast.success('Cover uploaded!');
        } catch (err) {
            toast.error('Upload failed: ' + (err?.response?.data?.error || err.message));
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        if (!form.genre.trim()) return toast.error('Genre is required');
        setSaving(true);
        try {
            const payload = {
                ...form,
                title: form.title.trim(),
                author: form.author.trim(),
                genre: form.genre.trim(),
                excerpt: form.excerpt.trim(),
                rating: Number(form.rating) || 5,
            };
            if (editId) {
                await updateBook(editId, payload);
                toast.success('Book updated! ✨');
            } else {
                await createBook(payload);
                toast.success('Book added! 📚');
            }
            setShowForm(false);
            fetchBooks();
        } catch (err) {
            const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Save failed';
            toast.error('Error: ' + msg);
            console.error('[BooksAdmin] Save error:', err?.response?.data || err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await deleteBook(id);
            toast.success('Book deleted');
            setBooks(prev => prev.filter(b => (b._id || b.id) !== id));
        } catch (err) {
            toast.error('Delete failed: ' + (err?.response?.data?.error || err.message));
        } finally {
            setDeleting(null);
        }
    };

    const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const selectStyle = {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '0.5rem',
        border: '1.5px solid var(--admin-border)',
        background: 'var(--admin-input-bg, var(--admin-card))',
        color: 'var(--admin-text)',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
    };

    return (
        <div>
            <div className="admin-page__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="admin-page__title">📚 Books</h1>
                    <p className="admin-page__subtitle">Share your book reviews and PDF downloads</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                    <BiPlus /> Add Book
                </button>
            </div>

            {/* ─── Modal Form ─── */}
            {showForm && (
                <div className="admin-modal-backdrop">
                    <div className="admin-modal" style={{ maxWidth: 760 }}>
                        <div className="admin-modal__header">
                            <h2 className="admin-modal__title">{editId ? '✏️ Edit Book' : '📚 Add New Book'}</h2>
                            <button className="admin-modal__close" onClick={() => setShowForm(false)}><BiX /></button>
                        </div>

                        <form onSubmit={handleSave} className="admin-modal__body">

                            {/* ── Cover image ── */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">Cover Image</label>
                                <div className="admin-upload-area" style={{ maxHeight: 150, justifyContent: 'center' }}>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} />
                                    {uploading ? (
                                        <div className="admin-spinner" style={{ width: 32, height: 32 }} />
                                    ) : preview ? (
                                        <img src={preview} alt="cover" style={{ height: 120, objectFit: 'contain', borderRadius: '0.5rem' }} />
                                    ) : (
                                        <>
                                            <BiUpload style={{ fontSize: '2rem', color: 'var(--admin-primary)', marginBottom: '0.4rem' }} />
                                            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Click to upload cover (max 5 MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    className="admin-form__input"
                                    value={form.coverImage}
                                    onChange={e => { f('coverImage', e.target.value); setPreview(e.target.value); }}
                                    placeholder="Or paste cover image URL here"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>

                            {/* ── Title + Author ── */}
                            <div className="admin-grid-2">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Title *</label>
                                    <input
                                        className="admin-form__input"
                                        required
                                        value={form.title}
                                        onChange={e => f('title', e.target.value)}
                                        placeholder="e.g. Atomic Habits"
                                    />
                                </div>
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Author</label>
                                    <input
                                        className="admin-form__input"
                                        value={form.author}
                                        onChange={e => f('author', e.target.value)}
                                        placeholder="e.g. James Clear"
                                    />
                                </div>
                            </div>

                            {/* ── Genre ── */}
                            <div className="admin-grid-2">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Genre *</label>
                                    {customGenre ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                className="admin-form__input"
                                                value={form.genre}
                                                onChange={e => f('genre', e.target.value)}
                                                placeholder="Type custom genre"
                                            />
                                            <button type="button" className="admin-btn admin-btn--secondary" style={{ whiteSpace: 'nowrap' }}
                                                onClick={() => { setCustomGenre(false); f('genre', ''); }}>
                                                Pick from list
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select
                                                style={selectStyle}
                                                value={form.genre}
                                                onChange={e => f('genre', e.target.value)}
                                            >
                                                <option value="">Select genre…</option>
                                                {GENRE_OPTIONS.map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="admin-btn admin-btn--secondary" style={{ whiteSpace: 'nowrap' }}
                                                onClick={() => { setCustomGenre(true); f('genre', ''); }}>
                                                Custom…
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Published Year</label>
                                    <input
                                        className="admin-form__input"
                                        value={form.publishedYear}
                                        onChange={e => f('publishedYear', e.target.value)}
                                        placeholder="e.g. 2018"
                                    />
                                </div>
                            </div>

                            {/* ── Read date + Page count ── */}
                            <div className="admin-grid-2">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Date Read</label>
                                    <input
                                        className="admin-form__input"
                                        value={form.readDate}
                                        onChange={e => f('readDate', e.target.value)}
                                        placeholder="e.g. Jan 2025"
                                    />
                                </div>
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Page Count</label>
                                    <input
                                        className="admin-form__input"
                                        value={form.pageCount}
                                        onChange={e => f('pageCount', e.target.value)}
                                        placeholder="e.g. 320"
                                    />
                                </div>
                            </div>

                            {/* ── Rating ── */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">My Rating</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {STARS.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => f('rating', s)}
                                            style={{
                                                fontSize: '1.6rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: s <= form.rating ? '#f59e0b' : 'var(--admin-border)',
                                                transition: 'color 0.15s, transform 0.15s',
                                                padding: 0,
                                                lineHeight: 1,
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginLeft: '0.5rem' }}>
                                        {form.rating}/5
                                    </span>
                                </div>
                            </div>

                            {/* ── Download link ── */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">
                                    <BiDownload style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    Download / PDF Link (optional)
                                </label>
                                <input
                                    className="admin-form__input"
                                    value={form.downloadLink}
                                    onChange={e => f('downloadLink', e.target.value)}
                                    placeholder="https://drive.google.com/... or leave blank"
                                />
                            </div>

                            {/* ── Featured toggle ── */}
                            <div className="admin-form__group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <label className="admin-form__label" style={{ marginBottom: 0 }}>
                                    Show on Home Page (Featured)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => f('featured', !form.featured)}
                                    style={{
                                        fontSize: '1.9rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: form.featured ? 'var(--admin-primary)' : 'var(--admin-border)',
                                        transition: 'color 0.2s',
                                        padding: 0,
                                        lineHeight: 1,
                                    }}
                                    title={form.featured ? 'Click to unfeature' : 'Click to feature on homepage'}
                                >
                                    {form.featured ? <BiToggleRight /> : <BiToggleLeft />}
                                </button>
                                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                    {form.featured ? 'Will appear on homepage' : 'Hidden from homepage'}
                                </span>
                            </div>

                            {/* ── Excerpt ── */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">Short Excerpt <span style={{ fontWeight: 400, color: 'var(--admin-text-muted)' }}>(shown on book cards)</span></label>
                                <textarea
                                    className="admin-form__textarea"
                                    value={form.excerpt}
                                    onChange={e => f('excerpt', e.target.value)}
                                    placeholder="Write a 1-2 sentence summary that appears on the book listing card..."
                                    style={{ minHeight: 80 }}
                                />
                            </div>

                            {/* ── Full Review ── */}
                            <div className="admin-form__group">
                                <label className="admin-form__label">
                                    Full Review / My Thoughts
                                    <span style={{ fontWeight: 400, color: 'var(--admin-text-muted)', marginLeft: 6, fontSize: '0.78rem' }}>
                                        — supports <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3 }}>## Heading</code>{' '}
                                        <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3 }}>**bold**</code>{' '}
                                        <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3 }}>- list</code>
                                    </span>
                                </label>
                                <textarea
                                    className="admin-form__textarea"
                                    value={form.review}
                                    onChange={e => f('review', e.target.value)}
                                    placeholder="## My Thoughts&#10;&#10;Write your full review here. You can use markdown.&#10;&#10;## Key Takeaways&#10;&#10;- Point one&#10;- Point two&#10;&#10;## Final Rating&#10;&#10;⭐⭐⭐⭐⭐"
                                    style={{ minHeight: 240, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.65 }}
                                />
                            </div>

                            {/* ── Action buttons ── */}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                                    {saving
                                        ? <><span className="admin-spinner" style={{ width: 16, height: 16, display: 'inline-block', marginRight: 6 }} />Saving…</>
                                        : editId ? '💾 Update Book' : '📚 Add Book'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Books Grid ─── */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="admin-spinner" />
                </div>
            ) : books.length === 0 ? (
                <div className="admin-card admin-empty" style={{ textAlign: 'center', padding: '3rem' }}>
                    <BiBook style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <p style={{ marginBottom: '1rem' }}>No books yet. Add your first book review!</p>
                    <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                        <BiPlus /> Add First Book
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {books.map(book => {
                        const id = book._id || book.id;
                        const starsFilled = Math.round(book.rating || 5);
                        const stars = '★'.repeat(starsFilled) + '☆'.repeat(5 - starsFilled);

                        return (
                            <div key={id} className="admin-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                {/* Cover thumbnail */}
                                <div style={{
                                    width: 70, height: 100, flexShrink: 0,
                                    background: 'linear-gradient(135deg, hsl(250,69%,20%), hsl(250,69%,40%))',
                                    borderRadius: '0.5rem', overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                }}>
                                    {book.coverImage
                                        ? <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <BiBook style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.5)' }} />
                                    }
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--admin-text)', marginBottom: 2, wordBreak: 'break-word' }}>
                                        {book.title}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginBottom: 4 }}>
                                        by {book.author || '—'}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#f59e0b', letterSpacing: 1, marginBottom: 4 }}>{stars}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6 }}>
                                        {book.genre}{book.publishedYear ? ` · ${book.publishedYear}` : ''}
                                    </div>
                                    {book.featured && (
                                        <span style={{
                                            display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
                                            background: 'var(--admin-primary)', color: '#fff',
                                            padding: '0.15rem 0.6rem', borderRadius: 999, marginBottom: 6,
                                        }}>
                                            ✦ Featured
                                        </span>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4 }}>
                                        <button
                                            className="admin-btn admin-btn--secondary"
                                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                            onClick={() => openEdit(book)}
                                        >
                                            <BiEdit />
                                        </button>
                                        <button
                                            className="admin-btn"
                                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                                            onClick={() => handleDelete(id)}
                                            disabled={deleting === id}
                                        >
                                            {deleting === id ? '…' : <BiTrash />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BooksAdmin;
