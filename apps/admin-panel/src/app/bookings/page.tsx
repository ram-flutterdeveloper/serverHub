'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { GridColDef } from '@mui/x-data-grid';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import DataTable from '@/components/tables/DataTable';
import { bookingsService } from '@/services/bookings.service';
import { useApiData } from '@/hooks/useApiData';
import {
  BookingStatus,
  PaymentStatus,
  type Booking,
  type BookingStatus as BookingStatusType,
  type ListParams,
} from '@/types/api';
import { formatCurrency, formatDateTime } from '@/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...Object.values(BookingStatus).map((value) => ({ value, label: value.replace(/_/g, ' ') })),
];

const PAYMENT_OPTIONS = [
  { value: '', label: 'All payment statuses' },
  { value: PaymentStatus.PENDING, label: 'Pending' },
  { value: PaymentStatus.PAID, label: 'Paid' },
];

export default function BookingsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const params = useMemo<ListParams>(
    () => ({
      page,
      limit: pageSize,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      // The backend only applies the range when both bounds are present.
      ...(from && to ? { from, to } : {}),
    }),
    [page, pageSize, search, status, paymentStatus, from, to],
  );

  const bookings = useApiData(
    (signal) => bookingsService.list(params, signal),
    [JSON.stringify(params)],
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const updateFilter = (setter: (value: string) => void) => (value: string | string[]) => {
    setter(String(value));
    setPage(1);
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'bookingNumber',
        headerName: 'Booking',
        flex: 0.8,
        minWidth: 150,
        sortable: false,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value as string}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime((params.row as Booking).createdAt)}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'user',
        headerName: 'Customer',
        flex: 1,
        minWidth: 180,
        sortable: false,
        valueGetter: (value: Booking['user']) =>
          value ? `${value.firstName ?? ''} ${value.lastName ?? ''}`.trim() || value.mobile : '—',
      },
      {
        field: 'provider',
        headerName: 'Provider',
        flex: 1,
        minWidth: 170,
        sortable: false,
        valueGetter: (value: Booking['provider']) =>
          value ? value.businessName || value.ownerName || 'Provider' : 'Unassigned',
      },
      {
        field: 'bookingDate',
        headerName: 'Schedule',
        flex: 0.9,
        minWidth: 160,
        sortable: false,
        valueGetter: (value: string, row: Booking) =>
          `${formatDateTime(value)} • ${row.bookingTime ?? ''}`.trim(),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.7,
        minWidth: 140,
        sortable: false,
        renderCell: (params) => <StatusChip status={params.value as string} />,
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        flex: 0.6,
        minWidth: 130,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              size="small"
              label={params.value as string}
              color={params.value === PaymentStatus.PAID ? 'success' : 'warning'}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {(params.row as Booking).paymentMethod}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'totalAmount',
        headerName: 'Amount',
        flex: 0.6,
        minWidth: 120,
        sortable: false,
        valueGetter: (value: number | string) => formatCurrency(Number(value)),
      },
    ],
    [],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Bookings"
        subtitle="Every booking across users and providers"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Bookings' }]}
        action={
          <Button startIcon={<Refresh />} onClick={bookings.refetch}>
            Refresh
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ minWidth: 200 }}>
          <FormSelect
            label="Status"
            value={status}
            onChange={updateFilter(setStatus)}
            options={STATUS_OPTIONS}
          />
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <FormSelect
            label="Payment"
            value={paymentStatus}
            onChange={updateFilter(setPaymentStatus)}
            options={PAYMENT_OPTIONS}
          />
        </Box>
        <FormInput
          label="From"
          value={from}
          onChange={(value) => {
            setFrom(value);
            setPage(1);
          }}
          type="date"
        />
        <FormInput
          label="To"
          value={to}
          onChange={(value) => {
            setTo(value);
            setPage(1);
          }}
          type="date"
        />
      </Stack>

      {(status || paymentStatus || from || to) && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          onClose={() => {
            setStatus('');
            setPaymentStatus('');
            setFrom('');
            setTo('');
            setPage(1);
          }}
        >
          {from && !to && 'Select both dates — the backend ignores a partial date range. '}
          Filters are applied by the backend and reset to page 1.
        </Alert>
      )}

      <DataTable
        rows={bookings.data?.rows ?? []}
        columns={columns}
        loading={bookings.loading}
        error={bookings.error}
        onRetry={bookings.refetch}
        totalRows={bookings.data?.total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={handleSearch}
        searchPlaceholder="Search booking number"
        onRowClick={(row: Booking) => router.push(`/bookings/${row.id}`)}
        emptyMessage="No bookings match the current filters"
      />

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Status values follow the backend lifecycle: {Object.values(BookingStatus).join(' → ')}.
        Admins can only assign providers to{' '}
        {BookingStatus.PENDING as BookingStatusType} bookings.
      </Typography>
    </AdminLayout>
  );
}