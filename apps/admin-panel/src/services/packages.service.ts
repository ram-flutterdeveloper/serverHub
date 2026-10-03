import { apiClient, toFormData } from '@/lib/api-client';
import type {
  PackageDetailsPayload,
  PackageDetailsResponse,
  PackagePayload,
  PackageRecord,
} from '@/types/api';

export const packagesService = {
  /** GET /api/v1/packages – includes `subCategory`, ordered by `sortOrder`. */
  async list(signal?: AbortSignal): Promise<PackageRecord[]> {
    const res = await apiClient.get<PackageRecord[]>('/packages', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** GET /api/v1/packages/services/:serviceId */
  async listByService(serviceId: string, signal?: AbortSignal): Promise<PackageRecord[]> {
    if (!serviceId) return [];
    const res = await apiClient.get<PackageRecord[]>(`/packages/services/${serviceId}`, { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** GET /api/v1/packages/sub-category/:subCategoryId */
  async listBySubCategory(subCategoryId: string, signal?: AbortSignal): Promise<PackageRecord[]> {
    if (!subCategoryId) return [];
    const res = await apiClient.get<PackageRecord[]>(`/packages/sub-category/${subCategoryId}`, { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/packages – multipart (optional `image` file). */
  create(payload: PackagePayload) {
    return apiClient.post<PackageRecord>(
      '/packages',
      toFormData(payload as unknown as Record<string, unknown>),
    );
  },

  /** PUT /api/v1/packages/:id – multipart. */
  update(id: string, payload: PackagePayload) {
    return apiClient.put<PackageRecord>(
      `/packages/${id}`,
      toFormData(payload as unknown as Record<string, unknown>),
    );
  },

  /** DELETE /api/v1/packages/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/packages/${id}`);
  },

  /** GET /api/v1/packages/:packageId/details */
  getDetails(id: string, signal?: AbortSignal) {
    return apiClient
      .get<PackageDetailsResponse>(`/packages/${id}/details`, { signal })
      .then((res) => res.data);
  },

  /** POST /api/v1/packages/:packageId/details */
  createDetails(id: string, payload: PackageDetailsPayload) {
    return apiClient.post<PackageDetailsResponse>(`/packages/${id}/details`, payload);
  },

  /** PUT /api/v1/packages/:packageId/details – replaces every detail collection. */
  updateDetails(id: string, payload: PackageDetailsPayload) {
    return apiClient.put<PackageDetailsResponse>(`/packages/${id}/details`, payload);
  },
};