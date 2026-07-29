'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AttachMoney,
  TrendingDown,
  HourglassBottom,
  ErrorOutline,
  Visibility,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import ViewDrawer from '@/components/dialogs/ViewDrawer';
import { dummyPayments } from '@/data/payments';
import { Payment, PaymentMethod, PaymentStatus } from '@/types';
import { formatDate, formatCurrency } from '@/utils';

const methodFilterOptions = ['All', 'Stripe', 'Razorpay', 'Wallet', 'Cash'];
const statusFilterOptions = ['All', 'Pending', 'Paid', 'Refunded', 'Failed'];

const methodColors: Record<string, 'primary' | 'secondary' | 'info' | 'warning' | 'default'> = {
  stripe: 'primary',
  razorpay: 'secondary',
  wallet: 'info',
  cash: 'warning',
};

export default function PaymentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const stats = useMemo(() => {
    const paid = dummyPayments.filter(
      (p) => p.status === PaymentStatus.PAID || p.status === PaymentStatus.PARTIAL
    );
    const totalRevenue = paid.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunds = dummyPayments.reduce((sum, p) => sum + p.refundAmount, 0);
    const pending = dummyPayments.filter((p) => p.status === PaymentStatus.PENDING).length;
    const failed = dummyPayments.filter((p) => p.status === PaymentStatus.FAILED).length;
    return { totalRevenue, totalRefunds, pending, failed };
  }, []);

  const filtered = useMemo(() => {
    let result = dummyPayments;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(q) ||
          p.bookingNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      );
    }

    if (methodFilter !== 'All') {
      result = result.filter((p) => p.method === methodFilter.toLowerCase() as PaymentMethod);
    }

    if (statusFilter !== 'All') {
      result = result.filter(
        (p) => p.status === statusFilter.toLowerCase() as PaymentStatus
      );
    }

    return result;
  }, [search, methodFilter, statusFilter]);

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      flex: 1.3,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.transactionId}
        </Typography>
      ),
    },
    {
      field: 'bookingNumber',
      headerName: 'Booking #',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(row.amount)}
        </Typography>
      ),
    },
    {
      field: 'method',
      headerName: 'Method',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Chip
          label={row.method.charAt(0).toUpperCase() + row.method.slice(1)}
          color={methodColors[row.method] || 'default'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500, textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    {
      field: 'refundAmount',
      headerName: 'Refund',
      flex: 0.7,
      minWidth: 90,
      renderCell: ({ row }) =>
        row.refundAmount > 0 ? (
          <Typography variant="body2" color="error.main" fontWeight={500}>
            {formatCurrency(row.refundAmount)}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View">
          <IconButton size="small" onClick={() => handleView(row)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Payments"
        subtitle="Manage all payments"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<AttachMoney />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Refunds" value={formatCurrency(stats.totalRefunds)} icon={<TrendingDown />} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending" value={stats.pending} icon={<HourglassBottom />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Failed" value={stats.failed} icon={<ErrorOutline />} color="error" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={methodFilter}
            label="Method"
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            {methodFilterOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusFilterOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search by transaction ID, booking #, customer..."
        emptyMessage="No payments found matching your filters."
      />

      <ViewDrawer
        open={drawerOpen}
        title="Payment Details"
        onClose={() => setDrawerOpen(false)}
      >
        {selectedPayment && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Payment ID</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedPayment.id}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedPayment.transactionId}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Booking Number</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedPayment.bookingNumber}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Customer</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedPayment.customerName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Amount</Typography>
              <Typography variant="body1" fontWeight={600} color="primary.main">
                {formatCurrency(selectedPayment.amount)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Payment Method</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedPayment.method.charAt(0).toUpperCase() + selectedPayment.method.slice(1)}
                  color={methodColors[selectedPayment.method] || 'default'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 0.5 }}>
                <StatusChip status={selectedPayment.status} size="medium" />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Refund Amount</Typography>
              <Typography variant="body1" fontWeight={600}>
                {selectedPayment.refundAmount > 0
                  ? formatCurrency(selectedPayment.refundAmount)
                  : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Created At</Typography>
              <Typography variant="body1">{formatDate(selectedPayment.createdAt)}</Typography>
            </Box>
          </Box>
        )}
      </ViewDrawer>
    </AdminLayout>
  );
}
