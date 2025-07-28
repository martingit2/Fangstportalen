import axios from 'axios';
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';
import type { FangstmeldingFormData } from '../schemas/fangstmeldingSchema';
import type { OrdreFormData } from '../schemas/ordreSchema';
import type { AxiosResponse } from 'axios';

interface CreateSluttseddelPayload {
    ordreId: number;
    landingsdato: string;
    linjer: {
        ordrelinjeId: number;
        faktiskKvantum: number;
    }[];
}

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

export const deleteOrdre = (ordreId: number): Promise<AxiosResponse<void>> => {
    return apiClient.delete(`/ordrer/${ordreId}`);
};

export const deleteFangstmelding = (fangstmeldingId: number): Promise<AxiosResponse<void>> => {
    return apiClient.delete(`/fangstmeldinger/${fangstmeldingId}`);
};

export const getOrdreById = (ordreId: number): Promise<AxiosResponse<OrdreResponseDto>> => {
    return apiClient.get(`/ordrer/${ordreId}`);
};

export const updateOrdre = (ordreId: number, data: OrdreFormData): Promise<AxiosResponse<OrdreResponseDto>> => {
    const payload = {
        ...data,
        ordrelinjer: data.ordrelinjer.map(linje => ({
            ...linje,
            avtaltPrisPerKg: parseFloat(linje.avtaltPrisPerKg),
            forventetKvantum: parseFloat(linje.forventetKvantum),
        }))
    };
    return apiClient.put(`/ordrer/${ordreId}`, payload);
};

export const getFangstmeldingById = (id: number): Promise<AxiosResponse<FangstmeldingResponseDto>> => {
    return apiClient.get(`/fangstmeldinger/${id}`);
};

export const updateFangstmelding = (id: number, data: FangstmeldingFormData): Promise<AxiosResponse<FangstmeldingResponseDto>> => {
    const payload = {
        ...data,
        fangstlinjer: data.fangstlinjer.map(linje => ({
            ...linje,
            estimertKvantum: parseFloat(linje.estimertKvantum),
        })),
    };
    return apiClient.put(`/fangstmeldinger/${id}`, payload);
};

export const getMineAvtalteOrdrer = (): Promise<AxiosResponse<OrdreResponseDto[]>> => {
    return apiClient.get('/ordrer/mine/avtalte');
};

export const createSluttseddel = (data: CreateSluttseddelPayload): Promise<AxiosResponse> => {
    return apiClient.post('/sluttsedler', data);
};

export default apiClient;