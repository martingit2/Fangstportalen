import axios from 'axios';
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';
import type { FangstmeldingFormData } from '../schemas/fangstmeldingSchema';
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

export const getAktiveFangstmeldinger = (): Promise<AxiosResponse<FangstmeldingResponseDto[]>> => {
    return apiClient.get('/fangstmeldinger/aktive');
};

export const createOrdreFromFangstmelding = (fangstmeldingId: number): Promise<AxiosResponse<OrdreResponseDto>> => {
    return apiClient.post('/ordrer/fra-fangstmelding', { fangstmeldingId });
};

export const createFangstmelding = (data: FangstmeldingFormData): Promise<AxiosResponse> => {
    const payload = {
        ...data,
        fangstlinjer: data.fangstlinjer.map(linje => ({
            ...linje,
            estimertKvantum: parseFloat(linje.estimertKvantum),
        })),
    };
    return apiClient.post('/fangstmeldinger', payload);
};

export const getMineFangstmeldinger = (): Promise<AxiosResponse<FangstmeldingResponseDto[]>> => {
    return apiClient.get('/fangstmeldinger/mine');
};

export const getTilgjengeligeOrdrer = (): Promise<AxiosResponse<OrdreResponseDto[]>> => {
    return apiClient.get('/ordrer/tilgjengelige');
};

export const aksepterOrdre = (ordreId: number): Promise<AxiosResponse<OrdreResponseDto>> => {
    return apiClient.patch(`/ordrer/${ordreId}/aksepter`);
};

export default apiClient;