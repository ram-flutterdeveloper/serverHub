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
  Receipt,
  ArrowUpward,
  ArrowDownward,
  Description,
  Event,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { dummyWalletTransactions } from '@/data/wallets';
import { formatCurrency, formatDate, formatDateTime } from '@/utils';

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const transaction = useMemo(
    () => dummyWalletTransactions.find((t) => t.id === transactionId),
    [transactionId]
  );

  if (!transaction) {
    return (
      <AdminLayout>
        <PageHeader
          title="Transaction Not Found"
          subtitle="The requested transaction could not be found"
          breadcrumbs={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Transactions', path: '/transactions' },
            { label: 'Not Found' },
          ]}
        />
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No transaction found with this ID
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/transactions')}
              sx={{ mt: 2 }}
            >
              Back to Transactions
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Transaction Details"
        subtitle={transaction.id}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Transactions', path: '/transactions' },
          { label: transaction.id },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/transactions')}
          >
            Back to Transactions
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Receipt color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Transaction Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transaction.id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Wallet ID
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transaction.walletId}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Owner
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transaction.ownerName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      {transaction.type === 'credit' ? (
                        <ArrowUpward fontSize="small" color="success" />
                      ) : (
                        <ArrowDownward fontSize="small" color="error" />
                      )}
                      <Chip
                        label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        color={transaction.type === 'credit' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                      sx={{ mt: 0.5 }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Balance After
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                      {formatCurrency(transaction.balance)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusChip status={transaction.status} size="medium" />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Description fontSize="small" color="action" sx={{ mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {transaction.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(transaction.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {transaction.id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Wallet
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {transaction.walletId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Owner
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {transaction.ownerName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip
                    label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    color={transaction.type === 'credit' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <StatusChip status={transaction.status} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(transaction.balance)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
