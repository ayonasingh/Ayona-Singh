import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import { useAdmin } from './AdminContext';
import toast from 'react-hot-toast';
import './AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { loginAdmin } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.username || !credentials.password) {
            return toast.error('Please fill in all fields');
        }
        setLoading(true);
        try {
            const res = await login(credentials);
            loginAdmin(res.data.token, res.data.username);
            toast.success('Welcome back, Admin! 👋');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login__bg"></div>
            <div className="admin-login__card">
                <div className="admin-login__logo">
                    <span className="admin-login__logo-icon">✦</span>
                    <h1 className="admin-login__title">Admin Panel</h1>
                    <p className="admin-login__subtitle">Portfolio Management System</p>
                </div>

                <form className="admin-login__form" onSubmit={handleSubmit}>
                    <div className="admin-login__field">
                        <label className="admin-login__label">Username</label>
                        <input
                            type="text"
                            className="admin-login__input"
                            placeholder="Enter username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            autoComplete="username"
                        />
                    </div>

                    <div className="admin-login__field">
                        <label className="admin-login__label">Password</label>
                        <input
                            type="password"
                            className="admin-login__input"
                            placeholder="Enter password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-login__btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="admin-login__spinner"></span>
                        ) : (
                            '🔐 Sign In'
                        )}
                    </button>
                </form>

                <p className="admin-login__hint">
                    Default: <strong>admin</strong> / <strong>admin123</strong>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
