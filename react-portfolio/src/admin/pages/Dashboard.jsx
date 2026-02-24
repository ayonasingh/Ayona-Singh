import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getBlogs, getContacts } from '../api';
import { useAdmin } from '../AdminContext';
import {
  BiEdit, BiImage, BiMessageSquareDetail, BiUser,
  BiHomeAlt, BiCog, BiTrendingUp, BiEnvelope,
} from 'react-icons/bi';

const Dashboard = () => {
  const { adminUser } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getBlogs(), getContacts()])
      .then(([statsRes, blogsRes, contactsRes]) => {
        setStats(statsRes.data);
        setRecentBlogs(blogsRes.data.slice(0, 3));
        setRecentMessages(contactsRes.data.slice(0, 4));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Blog Posts', value: stats?.blogsCount ?? '—', icon: <BiEdit />, to: '/admin/blogs', color: '#7c6ff7' },
    { label: 'Projects', value: stats?.projectsCount ?? '—', icon: <BiImage />, to: '/admin/portfolio', color: '#a775f0' },
    { label: 'Messages', value: stats?.messagesCount ?? '—', icon: <BiMessageSquareDetail />, to: '/admin/messages', color: '#63b3ed' },
    { label: 'Unread', value: stats?.unreadMessages ?? '—', icon: <BiEnvelope />, to: '/admin/messages', color: '#f6ad55' },
  ];

  const quickLinks = [
    { label: 'Edit Home', icon: <BiHomeAlt />, to: '/admin/home' },
    { label: 'Edit About', icon: <BiUser />, to: '/admin/about' },
    { label: 'Edit Skills', icon: <BiCog />, to: '/admin/skills' },
    { label: 'New Blog', icon: <BiEdit />, to: '/admin/blogs' },
    { label: 'New Project', icon: <BiImage />, to: '/admin/portfolio' },
    { label: 'View Messages', icon: <BiMessageSquareDetail />, to: '/admin/messages' },
  ];

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      {/* Header */}
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          Welcome back, {typeof adminUser === 'string' ? adminUser : 'Admin'} 👋
        </h1>
        <p className="admin-page__subtitle">Here's what's happening with your portfolio</p>
      </div>

      {/* Stat Cards */}
      <div className="dash-stats">
        {statCards.map((card) => (
          <Link to={card.to} className="dash-stat-card" key={card.label} style={{ '--card-color': card.color }}>
            <div className="dash-stat-card__icon">{card.icon}</div>
            <div className="dash-stat-card__body">
              <span className="dash-stat-card__value">{card.value}</span>
              <span className="dash-stat-card__label">{card.label}</span>
            </div>
            <BiTrendingUp className="dash-stat-card__trend" />
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        {/* Quick Actions */}
        <div className="admin-card">
          <h2 className="dash-section-title">⚡ Quick Actions</h2>
          <div className="dash-quick-links">
            {quickLinks.map((link) => (
              <Link to={link.to} className="dash-quick-link" key={link.label}>
                <span className="dash-quick-link__icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="admin-card">
          <div className="dash-section-header">
            <h2 className="dash-section-title">📝 Recent Blogs</h2>
            <Link to="/admin/blogs" className="dash-section-link">View All</Link>
          </div>
          {recentBlogs.length === 0 ? (
            <p className="admin-empty">No blogs yet</p>
          ) : (
            <div className="dash-list">
              {recentBlogs.map((blog) => (
                <div className="dash-list-item" key={blog.id}>
                  <div className="dash-list-item__text">
                    <p className="dash-list-item__title">{blog.title}</p>
                    <p className="dash-list-item__meta">{blog.date} · {blog.tag}</p>
                  </div>
                  <span className="admin-badge admin-badge--purple">{blog.readTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="dash-section-header">
            <h2 className="dash-section-title">💬 Recent Messages</h2>
            <Link to="/admin/messages" className="dash-section-link">View All</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="admin-empty">No messages yet</p>
          ) : (
            <div className="dash-list">
              {recentMessages.map((msg) => (
                <div className="dash-list-item" key={msg.id}>
                  <div className="dash-list-item__text">
                    <p className="dash-list-item__title">{msg.name}</p>
                    <p className="dash-list-item__meta">{msg.email}</p>
                  </div>
                  <span className={`admin-badge ${msg.read ? 'admin-badge--green' : 'admin-badge--red'}`}>
                    {msg.read ? 'Read' : 'New'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media(max-width:900px){ .dash-stats { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:480px){ .dash-stats { grid-template-columns: 1fr; } }

        .dash-stat-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-card-border);
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .dash-stat-card::after {
          content:'';
          position:absolute;
          bottom:0; left:0; right:0;
          height:3px;
          background: var(--card-color);
          opacity:0.7;
        }
        .dash-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
        }
        .dash-stat-card__icon {
          font-size: 1.75rem;
          color: var(--card-color);
          background: color-mix(in srgb, var(--card-color) 15%, transparent);
          padding: 0.6rem;
          border-radius: 0.65rem;
        }
        .dash-stat-card__body { flex: 1; }
        .dash-stat-card__value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--admin-text);
          line-height: 1;
        }
        .dash-stat-card__label {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
        }
        .dash-stat-card__trend { color: var(--card-color); opacity: 0.5; font-size: 1.1rem; }

        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media(max-width:768px){ .dash-grid { grid-template-columns: 1fr; } }

        .dash-section-title {
          font-size: 0.938rem;
          font-weight: 600;
          color: var(--admin-text);
          margin-bottom: 1rem;
        }
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .dash-section-header .dash-section-title { margin-bottom: 0; }
        .dash-section-link {
          font-size: 0.75rem;
          color: var(--admin-primary);
          text-decoration: none;
        }

        .dash-quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }
        .dash-quick-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.9rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--admin-card-border);
          border-radius: 0.65rem;
          color: var(--admin-text);
          font-size: 0.813rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .dash-quick-link:hover {
          background: hsl(250,69%,61%,0.12);
          border-color: hsl(250,69%,61%,0.3);
          color: var(--admin-primary);
        }
        .dash-quick-link__icon { font-size: 1.1rem; }

        .dash-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .dash-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.65rem;
          border: 1px solid var(--admin-card-border);
        }
        .dash-list-item__text { flex: 1; min-width: 0; }
        .dash-list-item__title {
          font-size: 0.813rem;
          color: var(--admin-text);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-list-item__meta {
          font-size: 0.7rem;
          color: var(--admin-text-muted);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
