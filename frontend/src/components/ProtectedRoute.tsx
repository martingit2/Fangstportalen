import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useClaims } from '../hooks/useClaims';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
    const { claims, isLoading: areClaimsLoading, error: claimsError } = useClaims();
    const location = useLocation();

    const isSystemLoading = isAuthLoading || areClaimsLoading;

    if (isSystemLoading) {
        return <div>Verifiserer brukerstatus...</div>;
    }

    if (claimsError) {
        return (
            <div>
                <h1>Feil ved lasting av brukerrettigheter</h1>
                <pre>{claimsError.message}</pre>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    const harOrg = !!claims?.org_id;
    const erPåOnboarding = location.pathname === '/onboarding';

    if (harOrg && !erPåOnboarding) {
        return <Outlet />;
    }

    if (harOrg && erPåOnboarding) {
        return <Navigate to="/dashboard" replace />;
    }
    
    if (!harOrg && erPåOnboarding) {
        return <Outlet />;
    }
    
    if (!harOrg && !erPåOnboarding) {
        return <Navigate to="/onboarding" replace />;
    }
    
    return <div>Uventet tilstand...</div>;
};

export default ProtectedRoute;