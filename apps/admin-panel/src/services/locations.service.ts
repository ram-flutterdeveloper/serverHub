import { apiClient } from '@/lib/api-client';
import type { Area, City } from '@/types/api';

export interface CityPayload {
  name: string;
  state: string;
  country?: string;
  googlePlaceId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
}

export interface AreaPayload {
  cityId: string;
  name: string;
  googlePlaceId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  pincode?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
}

export const citiesService = {
  /** GET /api/v1/cities */
  async list(signal?: AbortSignal): Promise<City[]> {
    const res = await apiClient.get<City[]>('/cities', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/cities */
  create(payload: CityPayload) {
    return apiClient.post<City>('/cities', payload);
  },

  /** PUT /api/v1/cities/:id */
  update(id: string, payload: CityPayload) {
    return apiClient.put<City>(`/cities/${id}`, payload);
  },

  /** DELETE /api/v1/cities/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/cities/${id}`);
  },
};

export const areasService = {
  /** GET /api/v1/areas */
  async list(signal?: AbortSignal): Promise<Area[]> {
    const res = await apiClient.get<Area[]>('/areas', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** GET /api/v1/areas/city/:cityId */
  async listByCity(cityId: string, signal?: AbortSignal): Promise<Area[]> {
    if (!cityId) return [];
    const res = await apiClient.get<Area[]>(`/areas/city/${cityId}`, { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/areas */
  create(payload: AreaPayload) {
    return apiClient.post<Area>('/areas', payload);
  },

  /** PUT /api/v1/areas/:id */
  update(id: string, payload: AreaPayload) {
    return apiClient.put<Area>(`/areas/${id}`, payload);
  },

  /** DELETE /api/v1/areas/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/areas/${id}`);
  },
};