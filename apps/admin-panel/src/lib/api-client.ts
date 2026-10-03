import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config';
import { tokenStorage } from './token-storage';

/* -------------------------------------------------------------------------- */
/*                                    Errors                                   */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;
  readonly isNetworkError: boolean;

  constructor(message: string, status: number, payload?: unknown, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.isNetworkError = isNetworkError;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Options                                   */
/* -------------------------------------------------------------------------- */

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Caller supplied signal used to cancel in-flight requests. */
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Set to false for public endpoints (login, refresh). */
  auth?: boolean;
  timeoutMs?: number;
  /** Skip the automatic refresh + retry (used by the refresh call itself). */
  skipAuthRetry?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown> | null;
}

/* -------------------------------------------------------------------------- */
/*                              Global 401 handler                             */
/* -------------------------------------------------------------------------- */

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Registers the callback invoked when a request finally fails with 401 after a
 * refresh attempt. `AuthProvider` uses it to clear the session and redirect.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                   */
/* -------------------------------------------------------------------------- */

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Converts a plain object into `FormData`, stringifying primitives and
 * dropping `undefined`/`null`/empty values. `File`/`Blob` values are appended
 * as-is so multer receives them under the right field name.
 */
export function toFormData(values: Record<string, unknown>): FormData {
  const form = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (value instanceof File || value instanceof Blob) {
      form.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File || item instanceof Blob) {
          form.append(key, item);
        } else if (item !== undefined && item !== null && item !== '') {
          form.append(key, String(item));
        }
      });
      return;
    }

    form.append(key, String(value));
  });

  return form;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown; errors?: unknown }).message;
    if (typeof message === 'string' && message) return message;

    const errors = (payload as { errors?: unknown }).errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0] as { msg?: unknown; message?: unknown };
      if (typeof first?.msg === 'string') return first.msg;
      if (typeof first?.message === 'string') return first.message;
    }
  }
  return fallback;
}

/* -------------------------------------------------------------------------- */
/*                              Refresh (single flight)                        */
/* -------------------------------------------------------------------------- */

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const payload = await parseBody(response);
      const data = payload as { data?: { accessToken?: string; refreshToken?: string } } | null;

      if (!response.ok || !data?.data?.accessToken) return null;

      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken ?? refreshToken);
      return data.data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/* -------------------------------------------------------------------------- */
/*                                  Request                                    */
/* -------------------------------------------------------------------------- */

async function execute<T>(method: string, path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const {
    query,
    body,
    signal,
    headers = {},
    auth = true,
    timeoutMs = REQUEST_TIMEOUT,
    skipAuthRetry = false,
  } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onExternalAbort, { once: true });
  }

  const requestHeaders: Record<string, string> = { Accept: 'application/json', ...headers };

  if (!isFormData && body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = tokenStorage.getAccessToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error) && signal?.aborted) {
      throw error;
    }
    throw new ApiError('Unable to reach the server. Please check your connection.', 0, error, true);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onExternalAbort);
  }

  const payload = await parseBody(response);

  if (response.ok) {
    const envelope = (payload ?? {}) as Partial<ApiResponse<T>>;
    return {
      success: envelope.success ?? true,
      message: envelope.message ?? '',
      data: (envelope.data ?? null) as T,
      meta: envelope.meta ?? null,
    };
  }

  if (response.status === 401 && auth && !skipAuthRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return execute<T>(method, path, { ...options, skipAuthRetry: true });
    }
    tokenStorage.clear();
    unauthorizedHandler?.();
  }

  throw new ApiError(
    extractMessage(payload, `Request failed with status ${response.status}`),
    response.status,
    payload,
  );
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions) {
    return execute<T>('GET', path, options);
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return execute<T>('POST', path, { ...options, body });
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return execute<T>('PUT', path, { ...options, body });
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return execute<T>('PATCH', path, { ...options, body });
  },
  delete<T>(path: string, options?: RequestOptions) {
    return execute<T>('DELETE', path, options);
  },
};

/* -------------------------------------------------------------------------- */
/*                           Pagination normalisation                         */
/* -------------------------------------------------------------------------- */

/**
 * The backend returns list payloads in a few different shapes:
 *  - plain arrays (master data, reviews)
 *  - `{ users | providers | bookings, total, page, limit, totalPages }`
 *  - `{ bookings, pagination: { total, page, limit, totalPages } }`
 *
 * This helper normalises all of them into `{ rows, total, page, limit, totalPages }`.
 */
export function normalizeList<T>(data: unknown, keys: string[], requestedPage = 1, requestedLimit = 10): {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  if (Array.isArray(data)) {
    return {
      rows: data as T[],
      total: data.length,
      page: 1,
      limit: data.length || requestedLimit,
      totalPages: 1,
    };
  }

  if (data && typeof data === 'object') {
    const container = data as Record<string, unknown>;
    const key = keys.find((candidate) => Array.isArray(container[candidate]));
    const rows = (key ? (container[key] as T[]) : []) ?? [];
    const metaSource = (container.pagination as Record<string, unknown> | undefined) ?? container;

    const total = Number(metaSource.total ?? rows.length);
    const page = Number(metaSource.page ?? requestedPage);
    const limit = Number(metaSource.limit ?? requestedLimit);
    const totalPages = Number(metaSource.totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 1));

    return { rows, total, page, limit, totalPages };
  }

  return { rows: [], total: 0, page: requestedPage, limit: requestedLimit, totalPages: 1 };
}