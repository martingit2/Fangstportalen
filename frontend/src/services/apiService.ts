import axios from 'axios';
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';
import type { FangstmeldingFormData } from '../schemas/fangstmeldingSchema';
import type { OrdreFormData } from '../schemas/ordreSchema';
import type { AxiosResponse } from 'axios';
import type { StatistikkResponseDto } from '../types/statistikk';
import type { FartoyFormData } from '../schemas/fartoySchema';
import type { FartoyResponseDto } from '../types/fartoy';
import type { TeamMedlemResponseDto } from '../types/team';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import type { BudOversiktResponseDto, BudResponseDto } from '../types/bud';
import type { BudFormData } from '../schemas/budSchema';
import type { InvitasjonFormData } from '../schemas/invitasjonSchema';

export interface PagedResult<T> {
    content: T[];
    pageNumber: number;
    totalPages: number;
    totalElements: number;
}

interface CreateSluttseddelPayload {
    ordreId: number;
    landingsdato: string;
    linjer: {
        ordrelinjeId: number;
        faktiskKvantum: number;
    }[];
}

interface AvvisSluttseddelPayload {
    begrunnelse: string;
}

interface FilterParams {
    leveringssted?: string;
    fiskeslag?: string;
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

export const getMineOrdrer = (page = 0, size = 5): Promise<AxiosResponse<PagedResult<OrdreResponseDto>>> =>
    apiClient.get('/ordrer/mine', { params: { page, size } });

export const getOrdrerKlareForSluttseddel = (): Promise<AxiosResponse<OrdreResponseDto[]>> => apiClient.get('/ordrer/klare-for-sluttseddel');

export const getAktiveFangstmeldinger = (filters?: FilterParams, page = 0, size = 15): Promise<AxiosResponse<PagedResult<FangstmeldingResponseDto>>> => {
    const params = new URLSearchParams();
    if (filters?.leveringssted) params.append('leveringssted', filters.leveringssted);
    if (filters?.fiskeslag) params.append('fiskeslag', filters.fiskeslag);
    params.append('page', String(page));
    params.append('size', String(size));
    return apiClient.get('/fangstmeldinger/aktive', { params });
};

export const createFangstmelding = (data: FangstmeldingFormData): Promise<AxiosResponse> => {
    const payload = {
        ...data,
        fangstlinjer: data.fangstlinjer.map(linje => ({
            ...linje,
            estimertKvantum: parseFloat(linje.estimertKvantum),
            utropsprisPerKg: parseFloat(linje.utropsprisPerKg),
        })),
    };
    return apiClient.post('/fangstmeldinger', payload);
};

export const getMineFangstmeldinger = (page = 0, size = 5): Promise<AxiosResponse<PagedResult<FangstmeldingResponseDto>>> =>
    apiClient.get('/fangstmeldinger/mine', { params: { page, size } });

export const getTilgjengeligeOrdrer = (filters?: FilterParams, page = 0, size = 15): Promise<AxiosResponse<PagedResult<OrdreResponseDto>>> => {
    const params = new URLSearchParams();
    if (filters?.leveringssted) params.append('leveringssted', filters.leveringssted);
    if (filters?.fiskeslag) params.append('fiskeslag', filters.fiskeslag);
    params.append('page', String(page));
    params.append('size', String(size));
    return apiClient.get('/ordrer/tilgjengelige', { params });
};

export const aksepterOrdre = (ordreId: number): Promise<AxiosResponse<OrdreResponseDto>> => apiClient.patch(`/ordrer/${ordreId}/aksepter`);
export const deleteOrdre = (ordreId: number): Promise<AxiosResponse<void>> => apiClient.delete(`/ordrer/${ordreId}`);
export const deleteFangstmelding = (fangstmeldingId: number): Promise<AxiosResponse<void>> => apiClient.delete(`/fangstmeldinger/${fangstmeldingId}`);
export const getOrdreById = (ordreId: number): Promise<AxiosResponse<OrdreResponseDto>> => apiClient.get(`/ordrer/${ordreId}`);
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
export const getFangstmeldingById = (id: number): Promise<AxiosResponse<FangstmeldingResponseDto>> => apiClient.get(`/fangstmeldinger/${id}`);
export const updateFangstmelding = (id: number, data: FangstmeldingFormData): Promise<AxiosResponse<FangstmeldingResponseDto>> => {
    const payload = {
        ...data,
        fangstlinjer: data.fangstlinjer.map(linje => ({
            ...linje,
            estimertKvantum: parseFloat(linje.estimertKvantum),
            utropsprisPerKg: parseFloat(linje.utropsprisPerKg),
        })),
    };
    return apiClient.put(`/fangstmeldinger/${id}`, payload);
};
export const createSluttseddel = (data: CreateSluttseddelPayload): Promise<AxiosResponse> => apiClient.post('/sluttsedler', data);
export const getStatistikkOversikt = (): Promise<AxiosResponse<StatistikkResponseDto>> => apiClient.get('/statistikk/oversikt');
export const createFartoy = (data: FartoyFormData): Promise<AxiosResponse<FartoyResponseDto>> => apiClient.post('/fartoy', data);
export const getMineFartoy = (): Promise<AxiosResponse<FartoyResponseDto[]>> => apiClient.get('/fartoy');
export const getMineTeamMedlemmer = (): Promise<AxiosResponse<TeamMedlemResponseDto[]>> => apiClient.get('/team/medlemmer');
export const getMineSluttsedler = (): Promise<AxiosResponse<SluttseddelResponseDto[]>> => apiClient.get('/sluttsedler/mine');
export const getSluttseddelById = (id: number): Promise<AxiosResponse<SluttseddelResponseDto>> => apiClient.get(`/sluttsedler/${id}`);
export const bekreftSluttseddel = (id: number): Promise<AxiosResponse<SluttseddelResponseDto>> => apiClient.patch(`/sluttsedler/${id}/bekreft`);
export const avvisSluttseddel = (id: number, data: AvvisSluttseddelPayload): Promise<AxiosResponse<SluttseddelResponseDto>> => apiClient.patch(`/sluttsedler/${id}/avvis`, data);
export const giBud = (fangstmeldingId: number, data: BudFormData): Promise<AxiosResponse<BudResponseDto>> => {
    const payload = {
        budLinjer: data.budLinjer.map(linje => ({
            ...linje,
            budPrisPerKg: parseFloat(linje.budPrisPerKg),
        }))
    };
    return apiClient.post(`/fangstmeldinger/${fangstmeldingId}/bud`, payload);
};
export const getBudOversiktForFangstmelding = (fangstmeldingId: number): Promise<AxiosResponse<BudOversiktResponseDto>> => apiClient.get(`/fangstmeldinger/${fangstmeldingId}/bud-oversikt`);
export const aksepterBud = (budId: number): Promise<AxiosResponse<OrdreResponseDto>> => apiClient.patch(`/bud/${budId}/aksepter`);

export const getMinProfil = () => apiClient.get('/brukere/min-profil');
export const updateMinProfil = (data: any) => apiClient.put('/brukere/min-profil', data);
export const getMinOrganisasjon = () => apiClient.get('/organisasjoner/min');
export const updateMinOrganisasjon = (data: any) => apiClient.put('/organisasjoner/min', data);
export const inviterMedlem = (data: InvitasjonFormData) => apiClient.post('/team/inviter', data);

export default apiClient;