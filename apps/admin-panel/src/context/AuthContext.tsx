'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, setUnauthorizedHandler } from '@/lib/api-client';
import { disconnectSocket } from '@/lib/socket-client';
import { tokenStorage } from '@/lib/token-storage';
import { authService } from '@/services/auth.service';
import { UserRole, type AuthUser, type SendOtpResult } from '@/types/api';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAdmin: boolean;
  error: string | null;
  /** OTP metadata returned by `send-otp` (dev builds also include the code). */
  lastOtp: SendOtpResult | null;
  sendOtp: (mobile: string) => Promise<SendOtpResult>;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NON_ADMIN_MESSAGE = 'This account does not have admin access.';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastOtp, setLastOtp] = useState<SendOtpResult | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    disconnectSocket();
    if (mounted.current) {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  /**
   * The role is always taken from the authenticated profile returned by
   * `GET /api/v1/profile` – never from anything persisted in the browser.
   */
  const loadProfile = useCallback(async (): Promise<AuthUser | null> => {
    if (!tokenStorage.getAccessToken()) {
      clearSession();
      return null;
    }

    try {
      const profile = await authService.getProfile();

      if (profile.role !== UserRole.ADMIN) {
        setError(NON_ADMIN_MESSAGE);
        clearSession();
        return null;
      }

      if (mounted.current) {
        setUser(profile);
        setStatus('authenticated');
        setError(null);
      }
      return profile;
    } catch (err) {
      const isAuthError = err instanceof ApiError && (err.status === 401 || err.status === 403);
      if (!isAuthError && err instanceof ApiError && !err.isNetworkError) {
        setError(err.message);
      }
      clearSession();
      return null;
    }
  }, [clearSession]);

  /* Global 401 handling: drop the session so the guard redirects to /login. */
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  /* Restore an existing session on first render. */
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!tokenStorage.getAccessToken()) {
        clearSession();
        return;
      }
      await loadProfile();
      if (cancelled) return;
    };

    void restore();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOtp = useCallback(async (mobile: string) => {
    const res = await authService.sendOtp(mobile);
    if (mounted.current) {
      setLastOtp(res.data);
      setError(null);
    }
    return res.data;
  }, []);

  const verifyOtp = useCallback(
    async (mobile: string, otp: string) => {
      const res = await authService.verifyOtp(mobile, otp);
      tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);

      if (res.data.user.role !== UserRole.ADMIN) {
        setError(NON_ADMIN_MESSAGE);
        tokenStorage.clear();
        setUser(null);
        setStatus('unauthenticated');
        throw new Error(NON_ADMIN_MESSAGE);
      }

      await loadProfile();
    },
    [loadProfile],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* the backend logout is a no-op; local session must still be cleared */
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAdmin: user?.role === UserRole.ADMIN,
      error,
      lastOtp,
      sendOtp,
      verifyOtp,
      logout,
      refreshProfile: async () => {
        await loadProfile();
      },
      clearError: () => setError(null),
    }),
    [status, user, error, lastOtp, sendOtp, verifyOtp, logout, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}