'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import {
  CalendarMonth,
  Visibility,
  CheckCircle,
  HourglassBottom,
  Cancel,
  ErrorOutline,
  AttachMoney,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import { dummyBookings } from '@/data/bookings';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import { formatDate, formatCurrency } from '@/utils';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings] = useState<Booking[]>(dummyBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filtered = useMemo(() => {
    let result = bookings;
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.providerName.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bookings, search, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: bookings.length,
      completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length,
      pending: bookings.filter((b) => b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED).length,
      active: bookings.filter((b) => b.status === BookingStatus.IN_PROGRESS).length,
      totalRevenue: bookings
        .filter((b) => b.paymentStatus === PaymentStatus.PAID)
        .reduce((sum, b) => sum + b.amount, 0),
    };
  }, [bookings]);

  const columns: GridColDef[] = [
    {
      field: 'bookingNumber',
      headerName: 'Booking #',
      width: 200,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {row.bookingNumber}
        </Typography>
      ),
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1.5,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.city}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'service',
      headerName: 'Service',
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.service}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.providerName}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'scheduledDate',
      headerName: 'Scheduled',
      width: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2">{formatDate(row.scheduledDate)}</Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(row.amount)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 130,
      renderCell: ({ row }) => (
        <StatusChip status={row.paymentStatus} />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={() => router.push(`/bookings/${row.id}`)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Bookings"
        subtitle="Manage all service bookings"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => setStatusFilter('all')}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              clickable
            />
            <Chip
              label="Active"
              onClick={() => setStatusFilter(BookingStatus.IN_PROGRESS)}
              color={statusFilter === BookingStatus.IN_PROGRESS ? 'warning' : 'default'}
              variant={statusFilter === BookingStatus.IN_PROGRESS ? 'filled' : 'outlined'}
              clickable
            />
            <Chip
              label="Completed"
              onClick={() => setStatusFilter(BookingStatus.COMPLETED)}
              color={statusFilter === BookingStatus.COMPLETED ? 'success' : 'default'}
              variant={statusFilter === BookingStatus.COMPLETED ? 'filled' : 'outlined'}
              clickable
            />
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Bookings" value={stats.total} icon={<CalendarMonth />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active" value={stats.active} icon={<HourglassBottom />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={<AttachMoney />} color="info" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search bookings by number, customer, service, or city..."
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={(row) => router.push(`/bookings/${row.id}`)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
