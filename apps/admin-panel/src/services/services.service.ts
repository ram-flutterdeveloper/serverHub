import { apiClient, toFormData } from '@/lib/api-client';
import type { Service, ServicePayload } from '@/types/api';

export const servicesService = {
  /** GET /api/v1/services */
  async list(signal?: AbortSignal): Promise<Service[]> {
    const res = await apiClient.get<Service[]>('/services', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** GET /api/v1/services/category/:categoryId */
  async listByCategory(categoryId: string, signal?: AbortSignal): Promise<Service[]> {
    if (!categoryId) return [];
    const res = await apiClient.get<Service[]>(`/services/category/${categoryId}`, { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/services – multipart (optional `image` file). */
  create(payload: ServicePayload) {
    return apiClient.post<Service>('/services', toFormData(payload as unknown as Record<string, unknown>));
  },

  /** PUT /api/v1/services/:id – multipart. */
  update(id: string, payload: ServicePayload) {
    return apiClient.put<Service>(`/services/${id}`, toFormData(payload as unknown as Record<string, unknown>));
  },

  /** DELETE /api/v1/services/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/services/${id}`);
  },

  /** GET /api/v1/services/:serviceId/cities – active `service_cities` rows. */
  async assignedCities(serviceId: string, signal?: AbortSignal): Promise<string[]> {
    const res = await apiClient.get<unknown>(`/services/${serviceId}/cities`, { signal });
    if (!Array.isArray(res.data)) return [];
    return (res.data as Array<{ cityId?: string } | string>)
      .map((row) => (typeof row === 'string' ? row : row.cityId))
      .filter((cityId): cityId is string => Boolean(cityId));
  },

  /** PUT /api/v1/services/:serviceId/cities – body `{ cityIds: string[] }`. */
  assignCities(serviceId: string, cityIds: string[]) {
    return apiClient.put<unknown>(`/services/${serviceId}/cities`, { cityIds });
  },
};