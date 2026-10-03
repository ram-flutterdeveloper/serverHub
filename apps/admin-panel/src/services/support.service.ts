import { apiClient } from '@/lib/api-client';
import type { CreateConversationPayload, SupportConversation, SupportMessage } from '@/types/api';

/**
 * Support module.
 *
 * Availability (verified against `apps/backend/src/app.ts` and
 * `/Users/apple/Downloads/serviceHub.postman_collection.json`):
 *
 * | Endpoint                                        | Status                        |
 * | ----------------------------------------------- | ----------------------------- |
 * | POST /api/v1/support/conversations               | mounted                       |
 * | GET  /api/v1/support/conversations               | documented, **not mounted**   |
 * | GET  /api/v1/admin/support/conversations         | not implemented               |
 * | GET  /api/v1/admin/support/conversations/:id     | not implemented               |
 * | POST /api/v1/admin/support/conversations/:id/messages | not implemented           |
 * | PATCH /api/v1/admin/support/conversations/:id/status  | not implemented           |
 * | PATCH /api/v1/admin/support/conversations/:id/assign  | not implemented           |
 *
 * The functions below are typed against the documented contract so the module
 * works as soon as the routes are mounted; today they surface a clear error to
 * the operator instead of fake data.
 */
export const supportService = {
  /** POST /api/v1/support/conversations – mounted. */
  create(payload: CreateConversationPayload = {}) {
    return apiClient
      .post<SupportConversation>('/support/conversations', payload)
      .then((res) => res.data);
  },

  /** GET /api/v1/support/conversations – documented in Postman, not mounted yet. */
  async list(signal?: AbortSignal): Promise<SupportConversation[]> {
    const res = await apiClient.get<unknown>('/support/conversations', { signal });
    if (Array.isArray(res.data)) return res.data as SupportConversation[];
    const container = res.data as { conversations?: unknown } | null;
    return Array.isArray(container?.conversations)
      ? (container.conversations as SupportConversation[])
      : [];
  },

  /** GET /api/v1/admin/support/conversations/:id/messages – not implemented. */
  messages(conversationId: string, signal?: AbortSignal) {
    return apiClient
      .get<SupportMessage[]>(`/admin/support/conversations/${conversationId}/messages`, { signal })
      .then((res) => res.data);
  },

  /** POST /api/v1/admin/support/conversations/:id/messages – not implemented. */
  reply(conversationId: string, message: string) {
    return apiClient.post<SupportMessage>(`/admin/support/conversations/${conversationId}/messages`, {
      message,
      messageType: 'TEXT',
    });
  },
};

/** Endpoints the admin support panel needs but the backend does not expose. */
export const SUPPORT_MISSING_ENDPOINTS = [
  'GET /api/v1/admin/support/conversations',
  'GET /api/v1/admin/support/conversations/:id',
  'GET /api/v1/admin/support/conversations/:id/messages',
  'POST /api/v1/admin/support/conversations/:id/messages',
  'PATCH /api/v1/admin/support/conversations/:id/status',
  'PATCH /api/v1/admin/support/conversations/:id/assign',
] as const;