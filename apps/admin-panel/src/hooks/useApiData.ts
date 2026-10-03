'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api-client';

interface ApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

/**
 * Runs an API call, tracks loading/error state and cancels the previous request
 * whenever the inputs change or the component unmounts.
 *
 * @param fetcher receives an `AbortSignal` and must forward it to the service call.
 * @param deps    dependency list; changing it triggers a new request.
 */
export function useApiData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList,
): ApiDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Fetching in an effect is the documented escape hatch for non-framework
    // data loading; resetting the request state before the call is required so
    // the table shows its skeleton again.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(toMessage(err));
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { data, loading, error, refetch, setData };
}