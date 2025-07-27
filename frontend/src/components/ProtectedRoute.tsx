import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Laster...</div>;
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
};

export default ProtectedRoute;