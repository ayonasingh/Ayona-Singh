import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import toast from 'react-hot-toast';

import {
    BiGridAlt, BiEdit, BiUser, BiBook,
    BiMessageSquareDetail, BiHomeAlt, BiCog,
    BiLogOut, BiMenu, BiX, BiChevronRight,
    BiImage, BiPhone,
} from 'react-icons/bi';

const navItems = [
    { to: '/admin/dashboard', icon: <BiGridAlt />, label: 'Dashboard' },
    { to: '/admin/home', icon: <BiHomeAlt />, label: 'Home' },
    { to: '/admin/about', icon: <BiUser />, label: 'About & Qualification' },
    { to: '/admin/skills', icon: <BiCog />, label: 'Skills' },
    { to: '/admin/blogs', icon: <BiEdit />, label: 'Blogs' },
    { to: '/admin/books', icon: <BiBook />, label: 'Books' },
    { to: '/admin/portfolio', icon: <BiImage />, label: 'Portfolio' },
    { to: '/admin/contact-info', icon: <BiPhone />, label: 'Contact Info' },
    { to: '/admin/messages', icon: <BiMessageSquareDetail />, label: 'Messages' },
];

const AdminLayout = () => {
    const { adminUser, logoutAdmin } = useAdmin();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logoutAdmin();
        toast.success('Logged out successfully');
        navigate('/admin');
    };

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
                <div className="admin-sidebar__header">
                    <div className="admin-sidebar__brand">
                        <span className="admin-sidebar__brand-icon">✦</span>
                        <span className="admin-sidebar__brand-text">Admin Panel</span>
                    </div>
                    <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
                        <BiX />
                    </button>
                </div>

                <nav className="admin-sidebar__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="admin-sidebar__link-icon">{item.icon}</span>
                            <span className="admin-sidebar__link-label">{item.label}</span>
                            <BiChevronRight className="admin-sidebar__link-arrow" />
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-sidebar__user">
                        <div className="admin-sidebar__user-avatar">
                            {String(adminUser || 'A')[0].toUpperCase()}
                        </div>
                        <div className="admin-sidebar__user-info">
                            <span className="admin-sidebar__user-name">{adminUser || 'Admin'}</span>
                            <span className="admin-sidebar__user-role">Administrator</span>
                        </div>
                    </div>
                    <button className="admin-sidebar__logout" onClick={handleLogout} title="Logout">
                        <BiLogOut />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <button className="admin-topbar__menu" onClick={() => setSidebarOpen(true)}>
                        <BiMenu />
                    </button>
                    <div className="admin-topbar__title">Portfolio Admin</div>
                    <a href="/" target="_blank" rel="noreferrer" className="admin-topbar__preview">
                        <BiBook /> View Site
                    </a>
                </header>

                {/* Page Content */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
