import { apiClient, normalizeList } from '@/lib/api-client';
import type {
  AssignProviderPayload,
  AvailableProvider,
  Booking,
  BookingsDashboardStats,
  ListParams,
  PaginatedResult,
} from '@/types/api';

export const bookingsService = {
  /** GET /api/v1/admin/bookings/dashboard */
  dashboard(signal?: AbortSignal) {
    return apiClient
      .get<BookingsDashboardStats>('/admin/bookings/dashboard', { signal })
      .then((res) => res.data);
  },

  /** GET /api/v1/admin/bookings – paginated with `{ bookings, pagination }`. */
  async list(
    params: ListParams = {},
    signal?: AbortSignal,
  ): Promise<PaginatedResult<Booking>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const res = await apiClient.get<unknown>('/admin/bookings', {
      query: { ...params, page, limit },
      signal,
    });
    return normalizeList<Booking>(res.data, ['bookings'], page, limit);
  },

  /** GET /api/v1/admin/bookings/:id */
  getById(id: string, signal?: AbortSignal) {
    return apiClient.get<Booking>(`/admin/bookings/${id}`, { signal }).then((res) => res.data);
  },

  /**
   * GET /api/v1/admin/bookings/:bookingId/providers
   * Providers that are ACTIVE, KYC verified, within their service radius and
   * available at the booking time – sorted by distance.
   */
  async availableProviders(bookingId: string, signal?: AbortSignal): Promise<AvailableProvider[]> {
    const res = await apiClient.get<unknown>(`/admin/bookings/${bookingId}/providers`, { signal });
    return normalizeList<AvailableProvider>(res.data, ['providers']).rows;
  },

  /**
   * PATCH /api/v1/admin/bookings/:bookingId/assign-provider
   * The backend only accepts bookings whose status is PENDING.
   */
  assignProvider(bookingId: string, payload: AssignProviderPayload) {
    return apiClient.patch<Booking>(`/admin/bookings/${bookingId}/assign-provider`, payload);
  },
};