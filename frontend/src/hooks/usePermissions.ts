import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const ROLES_CLAIM = 'https://fangstportalen.no/roles';

export const useRoles = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [roles, setRoles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        }
                    });
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setRoles(decodedToken[ROLES_CLAIM] || []);
                } catch (error) {
                    console.error('Error fetching user roles:', error);
                    setRoles([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchRoles();
    }, [isAuthenticated, getAccessTokenSilently]);

    return { roles, isLoading };
};