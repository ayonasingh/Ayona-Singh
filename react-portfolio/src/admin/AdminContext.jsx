import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from './api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            verifyToken()
                .then((res) => {
                    setIsAuthenticated(true);
                    setAdminUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('admin_token');
                    setIsAuthenticated(false);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const loginAdmin = (token, user) => {
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        setAdminUser(user);
    };

    const logoutAdmin = () => {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setAdminUser(null);
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, adminUser, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
