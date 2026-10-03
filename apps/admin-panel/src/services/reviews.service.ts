import { apiClient } from '@/lib/api-client';
import type { Review, ReviewUpdatePayload } from '@/types/api';

export const reviewsService = {
  /**
   * GET /api/v1/admin/reviews – not paginated by the backend.
   * Each row includes `user`, `provider` and `package`.
   */
  async list(signal?: AbortSignal): Promise<Review[]> {
    const res = await apiClient.get<Review[]>('/admin/reviews', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /api/v1/admin/reviews */
  create(payload: {
    bookingId: string;
    userId: string;
    providerId: string;
    packageId: string;
    rating: number;
    review?: string;
    images?: string[];
  }) {
    return apiClient.post<Review>('/admin/reviews', payload);
  },

  /** PATCH /api/v1/admin/reviews/:id – `rating`, `review`, `status`, `adminReply`. */
  update(id: string, payload: ReviewUpdatePayload) {
    return apiClient.patch<Review>(`/admin/reviews/${id}`, payload);
  },

  /** DELETE /api/v1/admin/reviews/:id */
  remove(id: string) {
    return apiClient.delete<unknown>(`/admin/reviews/${id}`);
  },
};