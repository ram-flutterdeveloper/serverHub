const ACCESS_TOKEN_KEY = 'servicehub_admin_access_token';
const REFRESH_TOKEN_KEY = 'servicehub_admin_refresh_token';

const isBrowser = typeof window !== 'undefined';

function read(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  if (!isBrowser) return;
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* storage unavailable (private mode) – ignore */
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return read(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return read(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string): void {
    write(ACCESS_TOKEN_KEY, accessToken);
    write(REFRESH_TOKEN_KEY, refreshToken);
  },
  setAccessToken(accessToken: string): void {
    write(ACCESS_TOKEN_KEY, accessToken);
  },
  clear(): void {
    write(ACCESS_TOKEN_KEY, null);
    write(REFRESH_TOKEN_KEY, null);
  },
};