import React, { useEffect, useState } from 'react';
import { getContacts, markContactRead, deleteContact } from '../api';
import toast from 'react-hot-toast';
import { BiCheck, BiTrash, BiEnvelope, BiUser, BiMessageDetail } from 'react-icons/bi';

const MessagesAdmin = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | unread | read
    const [expanded, setExpanded] = useState(null);

    const fetchContacts = () => {
        getContacts()
            .then((res) => setContacts(res.data))
            .catch(() => toast.error('Failed to load messages'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchContacts(); }, []);

    const handleMarkRead = async (id) => {
        try {
            await markContactRead(id);
            setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: true } : c));
            toast.success('Marked as read');
        } catch {
            toast.error('Failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await deleteContact(id);
            setContacts((prev) => prev.filter((c) => c.id !== id));
            toast.success('Message deleted');
        } catch {
            toast.error('Delete failed');
        }
    };

    const filtered = contacts.filter((c) => {
        if (filter === 'unread') return !c.read;
        if (filter === 'read') return c.read;
        return true;
    });

    const unreadCount = contacts.filter((c) => !c.read).length;

    return (
        <div>
            <div className="admin-page__header">
                <h1 className="admin-page__title">
                    💬 Messages
                    {unreadCount > 0 && (
                        <span className="admin-badge admin-badge--red" style={{ marginLeft: '0.75rem', verticalAlign: 'middle' }}>
                            {unreadCount} new
                        </span>
                    )}
                </h1>
                <p className="admin-page__subtitle">View and manage contact form submissions</p>
            </div>

            {/* Filter Tabs */}
            <div className="msg-filter-tabs">
                {['all', 'unread', 'read'].map((f) => (
                    <button key={f} className={`msg-filter-tab ${filter === f ? 'msg-filter-tab--active' : ''}`}
                        onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="msg-filter-count">
                            {f === 'all' ? contacts.length : contacts.filter((c) => f === 'unread' ? !c.read : c.read).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="admin-spinner" />
            ) : filtered.length === 0 ? (
                <div className="admin-card admin-empty">
                    <BiMessageDetail style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No {filter !== 'all' ? filter : ''} messages found</p>
                </div>
            ) : (
                <div className="msg-list">
                    {filtered.map((msg) => (
                        <div
                            className={`msg-card ${!msg.read ? 'msg-card--unread' : ''} ${expanded === msg.id ? 'msg-card--expanded' : ''}`}
                            key={msg.id}
                        >
                            <div className="msg-card__header" onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}>
                                <div className="msg-card__avatar">
                                    {msg.name ? msg.name[0].toUpperCase() : '?'}
                                </div>
                                <div className="msg-card__info">
                                    <div className="msg-card__name">
                                        {msg.name}
                                        {!msg.read && <span className="admin-badge admin-badge--red" style={{ marginLeft: '0.5rem' }}>New</span>}
                                    </div>
                                    <div className="msg-card__meta">
                                        <span><BiEnvelope /> {msg.email}</span>
                                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="msg-card__preview">
                                    {expanded !== msg.id && (
                                        <p className="msg-card__preview-text">{msg.message}</p>
                                    )}
                                </div>
                                <div className="msg-card__actions" onClick={(e) => e.stopPropagation()}>
                                    {!msg.read && (
                                        <button className="admin-btn admin-btn--secondary" onClick={() => handleMarkRead(msg.id)}
                                            style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }} title="Mark as read">
                                            <BiCheck />
                                        </button>
                                    )}
                                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(msg.id)}
                                        style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }} title="Delete">
                                        <BiTrash />
                                    </button>
                                </div>
                            </div>

                            {expanded === msg.id && (
                                <div className="msg-card__body">
                                    <div className="msg-card__subject">
                                        <strong>Subject:</strong> {msg.subject || '(none)'}
                                    </div>
                                    <p className="msg-card__message">{msg.message}</p>
                                    <div className="msg-card__reply-hint">
                                        <BiEnvelope />
                                        <a href={`mailto:${msg.email}`} className="msg-reply-link">Reply to {msg.email}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .msg-filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .msg-filter-tab {
          font-family: var(--admin-font);
          font-size: 0.813rem;
          font-weight: 500;
          background: var(--admin-card);
          border: 1px solid var(--admin-card-border);
          border-radius: 0.5rem;
          color: var(--admin-text-muted);
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .msg-filter-tab--active {
          background: hsl(250,69%,61%,0.15);
          border-color: hsl(250,69%,61%,0.35);
          color: var(--admin-primary);
        }
        .msg-filter-count {
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          padding: 0.05rem 0.45rem;
          font-size: 0.7rem;
        }

        .msg-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .msg-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-card-border);
          border-radius: 1rem;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .msg-card--unread {
          border-color: hsl(250,69%,61%,0.3);
          box-shadow: 0 0 0 1px hsl(250,69%,61%,0.1);
        }
        .msg-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .msg-card__header:hover { background: rgba(255,255,255,0.02); }
        .msg-card__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--admin-primary), hsl(280, 69%, 61%));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .msg-card__info { flex: 0 0 200px; min-width: 0; }
        @media(max-width:640px){ .msg-card__info { flex: 0 0 auto; } }
        .msg-card__name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text);
          display: flex;
          align-items: center;
        }
        .msg-card__meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.7rem;
          color: var(--admin-text-muted);
          margin-top: 0.2rem;
          flex-wrap: wrap;
        }
        .msg-card__meta span { display: flex; align-items: center; gap: 0.2rem; }
        .msg-card__preview { flex: 1; min-width: 0; }
        .msg-card__preview-text {
          font-size: 0.813rem;
          color: var(--admin-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .msg-card__actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
        .msg-card__body {
          padding: 0 1.25rem 1.25rem 1.25rem;
          padding-left: calc(1.25rem + 40px + 1rem);
        }
        .msg-card__subject {
          font-size: 0.813rem;
          color: var(--admin-text-muted);
          margin-bottom: 0.75rem;
        }
        .msg-card__message {
          font-size: 0.875rem;
          color: var(--admin-text);
          line-height: 1.65;
          white-space: pre-wrap;
          background: rgba(255,255,255,0.03);
          border-radius: 0.6rem;
          padding: 1rem;
          border: 1px solid var(--admin-card-border);
          margin-bottom: 0.75rem;
        }
        .msg-card__reply-hint {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--admin-text-muted);
        }
        .msg-reply-link { color: var(--admin-primary); text-decoration: none; }
        .msg-reply-link:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
};

export default MessagesAdmin;
