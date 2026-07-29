'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  AccountBalance,
  Person,
  CreditCard,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import { dummyWallets, dummyWalletTransactions } from '@/data/wallets';
import { formatCurrency, formatDate, formatDateTime } from '@/utils';

export default function WalletDetailPage() {
  const router = useRouter();
  const params = useParams();
  const walletId = params.id as string;

  const wallet = useMemo(
    () => dummyWallets.find((w) => w.id === walletId),
    [walletId]
  );

  const transactions = useMemo(
    () => dummyWalletTransactions.filter((t) => t.walletId === walletId),
    [walletId]
  );

  if (!wallet) {
    return (
      <AdminLayout>
        <PageHeader
          title="Wallet Not Found"
          subtitle="The requested wallet could not be found"
          breadcrumbs={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Wallet', path: '/wallet' },
            { label: 'Not Found' },
          ]}
        />
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No wallet found with this ID
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/wallet')}
              sx={{ mt: 2 }}
            >
              Back to Wallets
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {row.type === 'credit' ? (
            <ArrowUpward fontSize="small" color="success" />
          ) : (
            <ArrowDownward fontSize="small" color="error" />
          )}
          <Chip
            label={row.type.charAt(0).toUpperCase() + row.type.slice(1)}
            color={row.type === 'credit' ? 'success' : 'error'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500, textTransform: 'capitalize' }}
          />
        </Box>
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
      flex: 0.9,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2">{formatDate(row.createdAt)}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={wallet.ownerName}
        subtitle={`${wallet.ownerType.charAt(0).toUpperCase() + wallet.ownerType.slice(1)} Wallet`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Wallet', path: '/wallet' },
          { label: wallet.ownerName },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/wallet')}
          >
            Back to Wallets
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccountBalance color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Balance
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="h3"
                fontWeight={700}
                color="primary.main"
                sx={{ mb: 1 }}
              >
                {formatCurrency(wallet.balance, wallet.currency)}
              </Typography>
              <Chip
                label={wallet.isActive ? 'Active' : 'Inactive'}
                color={wallet.isActive ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Owner Info
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {wallet.ownerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Wallet ID
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {wallet.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={wallet.ownerType.charAt(0).toUpperCase() + wallet.ownerType.slice(1)}
                      color={wallet.ownerType === 'provider' ? 'primary' : 'info'}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Currency
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {wallet.currency}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CreditCard color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Transaction History
                </Typography>
              </Box>
              <DataTable
                rows={transactions}
                columns={columns}
                emptyMessage="No transactions found for this wallet."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
