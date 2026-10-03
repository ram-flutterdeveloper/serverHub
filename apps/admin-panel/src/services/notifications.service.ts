import { apiClient } from '@/lib/api-client';
import type { Notification, RegisterDevicePayload } from '@/types/api';

/**
 * Notifications module.
 *
 * Availability (verified against `apps/backend/src/modules/notifications`):
 * only `POST /api/v1/notifications/register-device` is mounted. The notification
 * routes file (`notification.routes.ts`) is empty, so listing / unread-count /
 * mark-as-read / delete are **not implemented** on the backend.
 */
export const notificationsService = {
  /** POST /api/v1/notifications/register-device – mounted. */
  registerDevice(payload: RegisterDevicePayload) {
    return apiClient.post<unknown>('/notifications/register-device', payload);
  },

  /** GET /api/v1/notifications – not implemented on the backend. */
  async list(signal?: AbortSignal): Promise<Notification[]> {
    const res = await apiClient.get<unknown>('/notifications', { signal });
    if (Array.isArray(res.data)) return res.data as Notification[];
    const container = res.data as { notifications?: unknown } | null;
    return Array.isArray(container?.notifications)
      ? (container.notifications as Notification[])
      : [];
  },

  /** GET /api/v1/notifications/unread-count – not implemented on the backend. */
  unreadCount() {
    return apiClient.get<{ count: number }>('/notifications/unread-count').then((res) => res.data.count);
  },

  /** PATCH /api/v1/notifications/:id/read – not implemented on the backend. */
  markAsRead(id: string) {
    return apiClient.patch<Notification>(`/notifications/${id}/read`);
  },

  /** PATCH /api/v1/notifications/read-all – not implemented on the backend. */
  markAllAsRead() {
    return apiClient.patch<unknown>('/notifications/read-all');
  },

  /** DELETE /api/v1/notifications/:id – not implemented on the backend. */
  remove(id: string) {
    return apiClient.delete<unknown>(`/notifications/${id}`);
  },
};

/** Endpoints the notifications module needs but the backend does not expose. */
export const NOTIFICATIONS_MISSING_ENDPOINTS = [
  'GET /api/v1/notifications',
  'GET /api/v1/notifications/unread-count',
  'PATCH /api/v1/notifications/:id/read',
  'PATCH /api/v1/notifications/read-all',
  'DELETE /api/v1/notifications/:id',
] as const;