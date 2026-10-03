'use client';

import React, { useCallback } from 'react';
import { Alert, Box, Paper } from '@mui/material';
import { DataGrid, GridNoRowsOverlay, GridOverlay } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams, GridValidRowModel } from '@mui/x-data-grid';
import SearchField from '../common/SearchField';
import EmptyState from '../common/EmptyState';
import { CircularProgress } from '@mui/material';

interface DataTableProps<R = GridValidRowModel> {
  rows: R[];
  columns: GridColDef[];
  loading?: boolean;
  /** Backend / network error message rendered above the grid. */
  error?: string | null;
  onRetry?: () => void;
  /**
   * Use client side pagination for endpoints that return the full collection
   * (master data endpoints are not paginated by the backend).
   */
  clientPagination?: boolean;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  checkboxSelection?: boolean;
  onRowClick?: (row: R) => void;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    </GridOverlay>
  );
}

function CustomNoRowsOverlay({ message }: { message: string }) {
  return (
    <GridNoRowsOverlay>
      <EmptyState title="No data" description={message} />
    </GridNoRowsOverlay>
  );
}

export default function DataTable<R = GridValidRowModel>({
  rows,
  columns,
  loading = false,
  error = null,
  onRetry,
  clientPagination = false,
  totalRows,
  onPageChange,
  onPageSizeChange,
  onSearch,
  searchPlaceholder = 'Search...',
  toolbar,
  checkboxSelection = false,
  onRowClick,
  emptyMessage = 'No records found.',
  page = 0,
  pageSize = 25,
}: DataTableProps<R>) {
  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      if (onRowClick) {
        onRowClick(params.row as R);
      }
    },
    [onRowClick]
  );

  const renderToolbar = () => {
    if (!toolbar && !onSearch) return undefined;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {onSearch && (
            <SearchField value="" onChange={onSearch} placeholder={searchPlaceholder} />
          )}
        </Box>
        {toolbar && <Box>{toolbar}</Box>}
      </Box>
    );
  };

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ m: 1.5 }} onClose={onRetry}>
          {error}
        </Alert>
      )}
      <DataGrid
        rows={rows as GridValidRowModel[]}
        columns={columns}
        loading={loading}
        rowCount={clientPagination ? rows.length : (totalRows ?? rows.length)}
        paginationMode={clientPagination ? 'client' : 'server'}
        paginationModel={clientPagination ? undefined : { page, pageSize }}
        onPaginationModelChange={
          clientPagination
            ? undefined
            : (model) => {
                if (model.page !== page && onPageChange) {
                  onPageChange(model.page);
                }
                if (model.pageSize !== pageSize && onPageSizeChange) {
                  onPageSizeChange(model.pageSize);
                }
              }
        }
        checkboxSelection={checkboxSelection}
        onRowClick={onRowClick ? handleRowClick : undefined}
        rowHeight={52}
        disableColumnFilter
        disableColumnMenu
        hideFooterSelectedRowCount
        slots={{
          toolbar: renderToolbar,
          loadingOverlay: CustomLoadingOverlay,
          noRowsOverlay: () => <CustomNoRowsOverlay message={emptyMessage} />,
        }}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'grey.50',
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'divider',
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: 'action.hover',
            cursor: onRowClick ? 'pointer' : 'default',
          },
        }}
      />
    </Paper>
  );
}
