'use client';

import React, { useMemo } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  AttachMoney,
  CalendarMonth,
  Engineering,
  Event,
  People,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import { bookingsService } from '@/services/bookings.service';
import { providersService } from '@/services/providers.service';
import { reviewsService } from '@/services/reviews.service';
import { usersService } from '@/services/users.service';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency, formatDate, formatPhone } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

function initials(name: string | null | undefined, fallback: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function DashboardPage() {
  const router = useRouter();

  const users = useApiData((signal) => usersService.dashboard(signal), []);
  const providers = useApiData((signal) => providersService.dashboard(signal), []);
  const bookings = useApiData((signal) => bookingsService.dashboard(signal), []);
  const recentBookings = useApiData(
    (signal) => bookingsService.list({ page: 1, limit: 5 }, signal),
    [],
  );
  const recentUsers = useApiData((signal) => usersService.list({ page: 1, limit: 5 }, signal), []);
  const recentProviders = useApiData((signal) => providersService.list({ page: 1, limit: 5 }, signal), []);
  const recentReviews = useApiData((signal) => reviewsService.list(signal), []);

  const statsLoading = users.loading || providers.loading || bookings.loading;
  const statsError = users.error ?? providers.error ?? bookings.error;

  const bookingStatusData = useMemo(() => {
    const stats = bookings.data;
    if (!stats) return [];
    return [
      { name: 'Pending', value: stats.pendingBookings },
      { name: 'Confirmed', value: stats.confirmedBookings },
      { name: 'Assigned', value: stats.assignedBookings },
      { name: 'In progress', value: stats.inProgressBookings },
      { name: 'Completed', value: stats.completedBookings },
      { name: 'Cancelled', value: stats.cancelledBookings },
    ].filter((entry) => entry.value > 0);
  }, [bookings.data]);

  const providerStatusData = useMemo(() => {
    const stats = providers.data;
    if (!stats) return [];
    return [
      { name: 'Active', value: stats.approvedProviders },
      { name: 'Pending', value: stats.pendingProviders },
      { name: 'Suspended', value: stats.suspendedProviders },
    ].filter((entry) => entry.value > 0);
  }, [providers.data]);

  const userStatusData = useMemo(() => {
    const stats = users.data;
    if (!stats) return [];
    return [
      { name: 'Active', value: stats.activeUsers },
      { name: 'Blocked', value: stats.blockedUsers },
      { name: 'New (30 days)', value: stats.newUsers },
    ].filter((entry) => entry.value > 0);
  }, [users.data]);

  const recentUserRows = recentUsers.data?.rows ?? [];
  const recentProviderRows = recentProviders.data?.rows ?? [];

  const refetchAll = () => {
    users.refetch();
    providers.refetch();
    bookings.refetch();
    recentBookings.refetch();
    recentUsers.refetch();
    recentProviders.refetch();
    recentReviews.refetch();
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of customers, providers and bookings"
        action={
          <Button variant="outlined" onClick={refetchAll}>
            Refresh
          </Button>
        }
      />

      {statsError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={refetchAll}>
          {statsError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Customers"
            value={users.data?.totalUsers ?? 0}
            icon={<People />}
            color="primary"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Providers"
            value={providers.data?.totalProviders ?? 0}
            icon={<Engineering />}
            color="info"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Bookings"
            value={bookings.data?.totalBookings ?? 0}
            icon={<CalendarMonth />}
            color="success"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(bookings.data?.totalRevenue ?? 0)}
            icon={<AttachMoney />}
            color="warning"
            loading={statsLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Bookings Today"
            value={bookings.data?.todayBookings ?? 0}
            icon={<Event />}
            color="info"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Completed Bookings"
            value={bookings.data?.completedBookings ?? 0}
            icon={<CalendarMonth />}
            color="success"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="New Customers (30d)"
            value={users.data?.newUsers ?? 0}
            icon={<People />}
            color="primary"
            loading={statsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Providers"
            value={providers.data?.pendingProviders ?? 0}
            icon={<Engineering />}
            color="warning"
            loading={statsLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader
              title="Recent Bookings"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  component={NextLink}
                  href="/bookings"
                >
                  View all
                </Button>
              }
            />
            <Divider />
            <TableContainer>
              {recentBookings.error && (
                <Alert severity="error" sx={{ m: 2 }}>
                  {recentBookings.error}
                </Alert>
              )}
              {recentBookings.loading ? (
                <Box sx={{ p: 2 }}>
                  {[0, 1, 2].map((row) => (
                    <Skeleton key={row} variant="text" height={42} />
                  ))}
                </Box>
              ) : recentBookings.data && recentBookings.data.rows.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.data.rows.map((booking) => (
                      <TableRow
                        key={booking.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {booking.bookingNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(booking.bookingDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {booking.user
                            ? `${booking.user.firstName ?? ''} ${booking.user.lastName ?? ''}`.trim() ||
                              booking.user.mobile
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={booking.status} />
                        </TableCell>
                        <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
                  No bookings yet.
                </Typography>
              )}
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardHeader title="Booking Status" />
            <Divider />
            <CardContent>
              {bookingStatusData.length > 0 ? (
                <DonutChart data={bookingStatusData} height={280} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not enough data to display the chart.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Provider Status" />
            <Divider />
            <CardContent>
              {providerStatusData.length > 0 ? (
                <BarChart
                  data={{
                    labels: providerStatusData.map((entry) => entry.name),
                    datasets: [
                      {
                        name: 'Providers',
                        data: providerStatusData.map((entry) => entry.value),
                      },
                    ],
                  }}
                  height={260}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No providers registered yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Customer Status" />
            <Divider />
            <CardContent>
              {userStatusData.length > 0 ? (
                <BarChart
                  data={{
                    labels: userStatusData.map((entry) => entry.name),
                    datasets: [
                      {
                        name: 'Customers',
                        data: userStatusData.map((entry) => entry.value),
                      },
                    ],
                  }}
                  height={260}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No customers registered yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="Recent Customers"
              action={
                <Button size="small" endIcon={<ArrowForward />} component={NextLink} href="/users">
                  View all
                </Button>
              }
            />
            <Divider />
            {recentUsers.loading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2].map((row) => (
                  <Skeleton key={row} variant="text" height={48} />
                ))}
              </Box>
            ) : recentUsers.error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {recentUsers.error}
              </Alert>
            ) : recentUserRows.length > 0 ? (
              <List disablePadding>
                {recentUserRows.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <ListItemButton onClick={() => router.push(`/users/${user.id}`)} sx={{ py: 1.5 }}>
                      <ListItemAvatar sx={{ minWidth: 56 }}>
                        <Avatar src={resolveMediaUrl(user.profileImage) ?? undefined} sx={{ bgcolor: 'primary.light' }}>
                          {initials(`${user.firstName ?? ''} ${user.lastName ?? ''}`, user.mobile.slice(-2))}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.mobile}
                        secondary={formatPhone(user.mobile, user.countryCode)}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <StatusChip status={user.status} />
                    </ListItemButton>
                    {index < recentUserRows.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
                No customers yet.
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="Recent Providers"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  component={NextLink}
                  href="/providers"
                >
                  View all
                </Button>
              }
            />
            <Divider />
            {recentProviders.loading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2].map((row) => (
                  <Skeleton key={row} variant="text" height={48} />
                ))}
              </Box>
            ) : recentProviders.error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {recentProviders.error}
              </Alert>
            ) : recentProviderRows.length > 0 ? (
              <List disablePadding>
                {recentProviderRows.map((provider, index) => (
                  <React.Fragment key={provider.id}>
                    <ListItemButton onClick={() => router.push(`/providers/${provider.id}`)} sx={{ py: 1.5 }}>
                      <ListItemAvatar sx={{ minWidth: 56 }}>
                        <Avatar
                          src={resolveMediaUrl(provider.profileImage) ?? undefined}
                          sx={{ bgcolor: 'info.light' }}
                        >
                          {initials(provider.businessName, 'P')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={provider.businessName}
                        secondary={`${provider.phone} · ${provider.experience} yr exp`}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <StatusChip status={provider.status} />
                    </ListItemButton>
                    {index < recentProviderRows.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
                No providers yet.
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardHeader
              title="Latest Reviews"
              action={
                <Button size="small" endIcon={<ArrowForward />} component={NextLink} href="/reviews">
                  View all
                </Button>
              }
            />
            <Divider />
            <TableContainer>
              {recentReviews.loading ? (
                <Box sx={{ p: 2 }}>
                  {[0, 1, 2].map((row) => (
                    <Skeleton key={row} variant="text" height={42} />
                  ))}
                </Box>
              ) : recentReviews.error ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  {recentReviews.error}
                </Alert>
              ) : recentReviews.data && recentReviews.data.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Package</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReviews.data.slice(0, 5).map((review) => (
                      <TableRow
                        key={review.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/reviews/${review.id}`)}
                      >
                        <TableCell>
                          {review.user
                            ? `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim() ||
                              review.user.id
                            : '—'}
                        </TableCell>
                        <TableCell>{review.provider?.businessName ?? '—'}</TableCell>
                        <TableCell>{review.package?.name ?? '—'}</TableCell>
                        <TableCell>{review.rating} ★</TableCell>
                        <TableCell>
                          <StatusChip status={review.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
                  No reviews yet.
                </Typography>
              )}
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}