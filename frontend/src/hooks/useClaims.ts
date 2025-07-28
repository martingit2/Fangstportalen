import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const CLAIMS_NAMESPACE = 'https://fangstportalen.no/claims';

export interface AppClaims {
    org_id: number;
    org_type: 'REDERI' | 'FISKEBRUK';
    fartoy_id?: number;
    roles: string[];
}

export const useClaims = () => {
    const { isAuthenticated, getAccessTokenSilently, isLoading: isAuthLoading } = useAuth0();
    const [claims, setClaims] = useState<AppClaims | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        const fetchClaims = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
                    cacheMode: 'off',
                });
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const appClaims = decodedToken[CLAIMS_NAMESPACE];
                setClaims(appClaims || null);
            } catch (e) {
                const err = e as Error;
                setError(err);
                setClaims(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClaims();
    }, [isAuthenticated, isAuthLoading, getAccessTokenSilently]);

    return { claims, isLoading, error };
};