import axios from 'axios';
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import type { OrdreResponseDto } from '../types/ordre';
import type { AxiosResponse } from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setupInterceptors = (getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>) => {
    apiClient.interceptors.request.use(
        async (config) => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    }
                });
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Could not get access token', error);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

export const getMineOrdrer = (): Promise<AxiosResponse<OrdreResponseDto[]>> => {
    return apiClient.get('/ordrer/mine');
};

export default apiClient;