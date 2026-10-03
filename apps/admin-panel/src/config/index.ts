export const config = {
  appName: 'ServiceHub',
  appDescription: 'Multi-Service Marketplace Admin Panel',
} as const;

/**
 * Absolute base URL of the backend API, e.g. `http://localhost:5000/api/v1`.
 * Requests are always built as `${apiBaseUrl}${path}` where `path` starts
 * with a `/`.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'
).replace(/\/$/, '');

/**
 * Base URL of the Socket.IO server (no `/api/v1` suffix).
 */
export const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:5000'
).replace(/\/$/, '');

/**
 * Base URL used to resolve relative upload paths returned by the backend
 * (e.g. `/uploads/packages/1712-ab.webp`).
 */
export const STORAGE_URL = (
  process.env.NEXT_PUBLIC_STORAGE_URL ?? SOCKET_URL
).replace(/\/$/, '');

/** Default request timeout in milliseconds. */
export const REQUEST_TIMEOUT = 30000;