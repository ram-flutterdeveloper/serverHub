import { apiClient } from '@/lib/api-client';
import type { AuthUser, RegisterDevicePayload, SendOtpResult, VerifyOtpResult } from '@/types/api';

export const authService = {
  /** POST /api/v1/auth/send-otp */
  sendOtp(mobile: string, signal?: AbortSignal) {
    return apiClient.post<SendOtpResult>('/auth/send-otp', { mobile }, { auth: false, signal });
  },

  /** POST /api/v1/auth/verify-otp */
  verifyOtp(mobile: string, otp: string) {
    return apiClient.post<VerifyOtpResult>(
      '/auth/verify-otp',
      { mobile, otp },
      { auth: false, skipAuthRetry: true },
    );
  },

  /** POST /api/v1/auth/logout */
  logout() {
    return apiClient.post<null>('/auth/logout');
  },

  /** GET /api/v1/profile – authoritative authenticated user. */
  getProfile(signal?: AbortSignal) {
    return apiClient.get<AuthUser>('/profile', { signal }).then((res) => res.data);
  },

  /** POST /api/v1/profile */
  updateProfile(payload: Partial<AuthUser>) {
    return apiClient.put<AuthUser>('/profile', payload);
  },

  /** POST /api/v1/notifications/register-device */
  registerDevice(payload: RegisterDevicePayload) {
    return apiClient.post<unknown>('/notifications/register-device', payload);
  },
};