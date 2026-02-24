import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdmin();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'hsl(250, 28%, 8%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="admin-spinner" style={{ width: 50, height: 50 }} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
