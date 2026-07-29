'use client';

import { useState, useMemo, useEffect } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  debounceMs?: number;
}

export function useSearch<T>({ data, searchKeys, debounceMs = 300 }: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filteredData = useMemo(() => {
    if (!debouncedTerm.trim()) return data;

    const lower = debouncedTerm.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lower);
      })
    );
  }, [data, searchKeys, debouncedTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
}
