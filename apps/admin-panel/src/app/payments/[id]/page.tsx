'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Receipt,
  CreditCard,
  Person,
  AccountBalance,
  Event,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { dummyPayments } from '@/data/payments';
import { PaymentStatus } from '@/types';
import { formatDate, formatCurrency, formatDateTime } from '@/utils';

const methodColors: Record<string, 'primary' | 'secondary' | 'info' | 'warning' | 'default'> = {
  stripe: 'primary',
  razorpay: 'secondary',
  wallet: 'info',
  cash: 'warning',
};

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const payment = useMemo(
    () => dummyPayments.find((p) => p.id === paymentId),
    [paymentId]
  );

  if (!payment) {
    return (
      <AdminLayout>
        <PageHeader
          title="Payment Not Found"
          subtitle="The requested payment could not be found"
          breadcrumbs={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Payments', path: '/payments' },
            { label: 'Not Found' },
          ]}
        />
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No payment found with this ID
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/payments')}
              sx={{ mt: 2 }}
            >
              Back to Payments
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const hasRefund = payment.refundAmount > 0;

  return (
    <AdminLayout>
      <PageHeader
        title="Payment Details"
        subtitle={payment.transactionId}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Payments', path: '/payments' },
          { label: payment.transactionId },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/payments')}
          >
            Back to Payments
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Receipt color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Payment Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Transaction ID
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {payment.transactionId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Chip
                      label={payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                      color={methodColors[payment.method] || 'default'}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500, textTransform: 'capitalize', mt: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusChip status={payment.status} size="medium" />
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
                      <Typography variant="body2">
                        {formatDateTime(payment.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalance color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Booking Reference
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Booking Number
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {payment.bookingNumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Booking ID
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {payment.bookingId}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Link
                    href={`/bookings/${payment.bookingId}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outlined" size="small">
                      View Booking
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {hasRefund && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AccountBalance color="warning" />
                  <Typography variant="h6" fontWeight={600}>
                    Refund Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Refund Amount
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        {formatCurrency(payment.refundAmount)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Original Amount
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Refund Ratio
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {Math.round((payment.refundAmount / payment.amount) * 100)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Customer
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {payment.customerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {payment.id}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
