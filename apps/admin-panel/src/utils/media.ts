import { STORAGE_URL } from '@/config';

/**
 * Resolves an upload path returned by the backend (`/uploads/...`) into an
 * absolute URL. Absolute URLs (`http://...`, `data:...`) are returned as-is.
 */
export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  const value = path.trim();
  if (!value) return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;

  const normalized = value.startsWith('/') ? value : `/${value}`;

  // The backend always returns paths that already carry the `/uploads` prefix.
  // When the configured storage base ends with `/uploads` as well, drop it from
  // the base so the result is not `/uploads/uploads/...`.
  if (normalized.startsWith('/uploads/')) {
    return `${STORAGE_URL.replace(/\/uploads\/?$/i, '')}${normalized}`;
  }

  return `${STORAGE_URL}${normalized}`;
}