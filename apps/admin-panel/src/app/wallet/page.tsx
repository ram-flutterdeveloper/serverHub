'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Visibility,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import { dummyWallets, dummyWalletTransactions } from '@/data/wallets';
import { formatCurrency } from '@/utils';

export default function WalletPage() {
  const router = useRouter();

  const stats = useMemo(() => {
    const totalBalance = dummyWallets.reduce((sum, w) => sum + w.balance, 0);
    const credits = dummyWalletTransactions.filter((t) => t.type === 'credit');
    const debits = dummyWalletTransactions.filter((t) => t.type === 'debit');
    const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);
    return { totalBalance, totalCredits, totalDebits };
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'ownerName',
      headerName: 'Owner Name',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.ownerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.id}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'ownerType',
      headerName: 'Type',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Chip
          label={row.ownerType.charAt(0).toUpperCase() + row.ownerType.slice(1)}
          color={row.ownerType === 'provider' ? 'primary' : 'info'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500, textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'balance',
      headerName: 'Balance',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(row.balance)}
        </Typography>
      ),
    },
    {
      field: 'currency',
      headerName: 'Currency',
      flex: 0.6,
      minWidth: 80,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => (
        <StatusChip status={row.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => router.push(`/wallet/${row.id}`)}
        >
          View Transactions
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Wallet"
        subtitle="Manage wallets and balances"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="Total Balance" value={formatCurrency(stats.totalBalance)} icon={<AccountBalance />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="Total Credits" value={formatCurrency(stats.totalCredits)} icon={<TrendingUp />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="Total Debits" value={formatCurrency(stats.totalDebits)} icon={<TrendingDown />} color="warning" />
        </Grid>
      </Grid>

      <DataTable
        rows={dummyWallets}
        columns={columns}
        emptyMessage="No wallets found."
      />
    </AdminLayout>
  );
}
