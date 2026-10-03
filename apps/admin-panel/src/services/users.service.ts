import { apiClient, normalizeList } from '@/lib/api-client';
import type { AdminUser, ListParams, PaginatedResult, UsersDashboardStats } from '@/types/api';

export const usersService = {
  /** GET /api/v1/admin/users/dashboard */
  dashboard(signal?: AbortSignal) {
    return apiClient.get<UsersDashboardStats>('/admin/users/dashboard', { signal }).then((res) => res.data);
  },

  /** GET /api/v1/admin/users – paginated with `{ users, total, page, limit, totalPages }`. */
  async list(params: ListParams = {}, signal?: AbortSignal): Promise<PaginatedResult<AdminUser>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const res = await apiClient.get<unknown>('/admin/users', { query: { ...params, page, limit }, signal });
    return normalizeList<AdminUser>(res.data, ['users'], page, limit);
  },

  /** GET /api/v1/admin/users/:id */
  getById(id: string, signal?: AbortSignal) {
    return apiClient.get<AdminUser>(`/admin/users/${id}`, { signal }).then((res) => res.data);
  },

  /** PATCH /api/v1/admin/users/:id/block */
  block(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/users/${id}/block`);
  },

  /** PATCH /api/v1/admin/users/:id/unblock */
  unblock(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/users/${id}/unblock`);
  },

  /** PATCH /api/v1/admin/users/:id/verify */
  verify(id: string) {
    return apiClient.patch<{ message: string }>(`/admin/users/${id}/verify`);
  },

  /** DELETE /api/v1/admin/users/:id (soft delete) */
  remove(id: string) {
    return apiClient.delete<{ message: string }>(`/admin/users/${id}`);
  },
};