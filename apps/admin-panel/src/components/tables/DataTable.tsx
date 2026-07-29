'use client';

import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridToolbar,
  GridNoRowsOverlay,
  GridOverlay,
} from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import SearchField from '../common/SearchField';
import EmptyState from '../common/EmptyState';
import { CircularProgress } from '@mui/material';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  checkboxSelection?: boolean;
  onRowClick?: (row: any) => void;
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

export default function DataTable({
  rows,
  columns,
  loading = false,
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
}: DataTableProps) {
  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      if (onRowClick) {
        onRowClick(params.row);
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
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={totalRows ?? rows.length}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          if (model.page !== page && onPageChange) {
            onPageChange(model.page);
          }
          if (model.pageSize !== pageSize && onPageSizeChange) {
            onPageSizeChange(model.pageSize);
          }
        }}
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
