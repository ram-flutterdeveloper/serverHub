import { apiClient, normalizeList } from '@/lib/api-client';
import type {
  AdminProvider,
  ListParams,
  PaginatedResult,
  ProvidersDashboardStats,
} from '@/types/api';

export const providersService = {
  /** GET /api/v1/admin/providers/dashboard */
  dashboard(signal?: AbortSignal) {
    return apiClient
      .get<ProvidersDashboardStats>('/admin/providers/dashboard', { signal })
      .then((res) => res.data);
  },

  /** GET /api/v1/admin/providers – paginated with `{ providers, total, page, limit, totalPages }`. */
  async list(
    params: ListParams = {},
    signal?: AbortSignal,
  ): Promise<PaginatedResult<AdminProvider>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const res = await apiClient.get<unknown>('/admin/providers', {
      query: { ...params, page, limit },
      signal,
    });
    return normalizeList<AdminProvider>(res.data, ['providers'], page, limit);
  },

  /** GET /api/v1/admin/providers/:id */
  getById(id: string, signal?: AbortSignal) {
    return apiClient.get<AdminProvider>(`/admin/providers/${id}`, { signal }).then((res) => res.data);
  },

  /** PATCH /api/v1/admin/providers/:id/approve */
  approve(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/approve`);
  },

  /** PATCH /api/v1/admin/providers/:id/reject */
  reject(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/reject`);
  },

  /** PATCH /api/v1/admin/providers/:id/suspend */
  suspend(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/suspend`);
  },

  /** PATCH /api/v1/admin/providers/:id/activate */
  activate(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/activate`);
  },

  /** PATCH /api/v1/admin/providers/:id/verify-kyc */
  verifyKyc(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/verify-kyc`);
  },

  /** PATCH /api/v1/admin/providers/:id/commission – body `{ commission }`. */
  updateCommission(id: string, commission: number) {
    return apiClient.patch<{ message: string }>(`/admin/providers/${id}/commission`, { commission });
  },
};