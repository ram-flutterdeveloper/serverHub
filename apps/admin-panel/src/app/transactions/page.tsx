'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  HourglassBottom,
  ErrorOutline,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import { dummyWalletTransactions } from '@/data/wallets';
import { WalletTransaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

const typeFilterOptions = ['All', 'Credit', 'Debit'];
const statusFilterOptions = ['All', 'Completed', 'Pending', 'Failed'];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = useMemo(() => {
    const credits = dummyWalletTransactions.filter((t) => t.type === 'credit');
    const debits = dummyWalletTransactions.filter((t) => t.type === 'debit');
    const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);
    const pending = dummyWalletTransactions.filter((t) => t.status === 'pending').length;
    const failed = dummyWalletTransactions.filter((t) => t.status === 'failed').length;
    return { totalCredits, totalDebits, pending, failed };
  }, []);

  const filtered = useMemo(() => {
    let result = dummyWalletTransactions;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.ownerName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'All') {
      result = result.filter((t) => t.type === typeFilter.toLowerCase() as 'credit' | 'debit');
    }

    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter.toLowerCase() as WalletTransaction['status']);
    }

    return result;
  }, [search, typeFilter, statusFilter]);

  const columns: GridColDef[] = [
    {
      field: 'ownerName',
      headerName: 'Owner',
      flex: 1.2,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.ownerName}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Chip
          label={row.type.charAt(0).toUpperCase() + row.type.slice(1)}
          color={row.type === 'credit' ? 'success' : 'error'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500, textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          fontWeight={600}
          color={row.type === 'credit' ? 'success.main' : 'error.main'}
        >
          {row.type === 'credit' ? '+' : '-'}{formatCurrency(row.amount)}
        </Typography>
      ),
    },
    {
      field: 'balance',
      headerName: 'Balance After',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={500}>
          {formatCurrency(row.balance)}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Transactions"
        subtitle="All wallet transactions"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Credits" value={formatCurrency(stats.totalCredits)} icon={<TrendingUp />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Debits" value={formatCurrency(stats.totalDebits)} icon={<TrendingDown />} color="error" />
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
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {typeFilterOptions.map((opt) => (
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
        searchPlaceholder="Search by owner, description..."
        emptyMessage="No transactions found matching your filters."
      />
    </AdminLayout>
  );
}
