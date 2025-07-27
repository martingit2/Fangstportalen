import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

export const usePermissions = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setPermissions(decodedToken.permissions || []);
                } catch (error) {
                    console.error('Error fetching user permissions:', error);
                    setPermissions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchPermissions();
    }, [isAuthenticated, getAccessTokenSilently]);

    return { permissions, isLoading };
};