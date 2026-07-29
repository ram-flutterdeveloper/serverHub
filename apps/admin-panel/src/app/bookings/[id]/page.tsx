'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  Person,
  Engineering,
  AttachMoney,
  LocationOn,
  Schedule,
  Payment,
  Notes,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { dummyBookings } from '@/data/bookings';
import { Booking } from '@/types';
import { formatDate, formatCurrency, formatDateTime } from '@/utils';

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const booking = useMemo(
    () => dummyBookings.find((b) => b.id === bookingId),
    [bookingId]
  );

  if (!booking) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Booking not found
        </Typography>
      </AdminLayout>
    );
  }

  const infoItems = [
    { icon: <Person />, text: 'Customer', value: booking.customerName },
    { icon: <Engineering />, text: 'Provider', value: booking.providerName },
    { icon: <CalendarMonth />, text: 'Service', value: booking.service },
    { icon: <Schedule />, text: 'Scheduled', value: `${formatDate(booking.scheduledDate)} at ${booking.scheduledTime}` },
    { icon: <LocationOn />, text: 'Address', value: booking.address },
    { icon: <Notes />, text: 'Notes', value: booking.notes },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={booking.bookingNumber}
        subtitle={booking.service}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Bookings', path: '/bookings' },
          { label: booking.bookingNumber },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/bookings')}>
            Back to Bookings
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                  {booking.bookingNumber}
                </Typography>
                <StatusChip status={booking.status} size="medium" />
                <StatusChip status={booking.paymentStatus} size="medium" />
              </Box>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Booking Details
              </Typography>
              <List disablePadding>
                {infoItems.map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      secondary={item.value}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Payment Summary
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Amount</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(booking.amount)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Commission</Typography>
                  <Typography variant="body2">{formatCurrency(booking.commission)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>Net Amount</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    {formatCurrency(booking.netAmount)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Activity
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CalendarMonth fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={formatDateTime(booking.createdAt)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Schedule fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scheduled"
                    secondary={formatDate(booking.scheduledDate)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
