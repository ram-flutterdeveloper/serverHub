import { apiClient, toFormData } from '@/lib/api-client';
import type { Category, CategoryPayload, SubCategory, SubCategoryPayload } from '@/types/api';

/* -------------------------------------------------------------------------- */
/*                                  Categories                                 */
/* -------------------------------------------------------------------------- */

export const categoriesService = {
  /** GET /api/v1/categories – not paginated by the backend. */
  async list(signal?: AbortSignal): Promise<Category[]> {
    const res = await apiClient.get<Category[]>('/categories', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/categories – multipart (optional `image` file). */
  create(payload: CategoryPayload) {
    return apiClient.post<Category>('/categories', toFormData(payload as unknown as Record<string, unknown>));
  },

  /** PUT /api/v1/categories/:id – multipart. */
  update(id: string, payload: CategoryPayload) {
    return apiClient.put<Category>(
      `/categories/${id}`,
      toFormData(payload as unknown as Record<string, unknown>),
    );
  },

  /** DELETE /api/v1/categories/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/categories/${id}`);
  },
};

/* -------------------------------------------------------------------------- */
/*                                Sub categories                               */
/* -------------------------------------------------------------------------- */

export const subCategoriesService = {
  /** GET /api/v1/sub-categories */
  async list(signal?: AbortSignal): Promise<SubCategory[]> {
    const res = await apiClient.get<SubCategory[]>('/sub-categories', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** GET /api/v1/sub-categories/service/:serviceId */
  async listByService(serviceId: string, signal?: AbortSignal): Promise<SubCategory[]> {
    if (!serviceId) return [];
    const res = await apiClient.get<SubCategory[]>(`/sub-categories/service/${serviceId}`, { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /**
   * POST /api/v1/sub-categories
   *
   * This route has no upload middleware, so the body must be JSON
   * (multipart bodies are not parsed and `serviceId` would be lost).
   */
  create(payload: SubCategoryPayload) {
    return apiClient.post<SubCategory>('/sub-categories', payload);
  },

  /** PUT /api/v1/sub-categories/:id – JSON, see `create`. */
  update(id: string, payload: SubCategoryPayload) {
    return apiClient.put<SubCategory>(`/sub-categories/${id}`, payload);
  },

  /** DELETE /api/v1/sub-categories/:id */
  remove(id: string) {
    return apiClient.delete<null>(`/sub-categories/${id}`);
  },
};