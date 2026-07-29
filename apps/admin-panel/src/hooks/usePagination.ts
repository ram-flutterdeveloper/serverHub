'use client';

import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  defaultRowsPerPage?: number;
}

interface UsePaginationReturn<T> {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  totalPages: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  paginatedData: T[];
}

export function usePagination<T>({
  data,
  defaultRowsPerPage = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleChangePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    totalCount,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,
    paginatedData,
  };
}
