'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  CalendarMonth,
  People,
  Engineering,
  Star,
  ArrowForward,
  Payment,
  RateReview,
  PersonAdd,
  Feedback,
  Event,
} from '@mui/icons-material';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import AreaChart from '@/components/charts/AreaChart';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';

import { dashboardStats } from '@/data/dashboard';
import { dummyBookings } from '@/data/bookings';
import { dummyReviews } from '@/data/reviews';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function formatFullCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'booking':
      return <CalendarMonth fontSize="small" sx={{ color: 'primary.main' }} />;
    case 'payment':
      return <Payment fontSize="small" sx={{ color: 'success.main' }} />;
    case 'review':
      return <RateReview fontSize="small" sx={{ color: 'warning.main' }} />;
    case 'signup':
      return <PersonAdd fontSize="small" sx={{ color: 'info.main' }} />;
    case 'refund':
      return <AttachMoney fontSize="small" sx={{ color: 'error.main' }} />;
    case 'support':
      return <Feedback fontSize="small" sx={{ color: 'secondary.main' }} />;
    default:
      return <Event fontSize="small" sx={{ color: 'text.secondary' }} />;
  }
}

function getActivityAvatarBg(type: string): string {
  switch (type) {
    case 'booking':
      return 'primary.light';
    case 'payment':
      return 'success.light';
    case 'review':
      return 'warning.light';
    case 'signup':
      return 'info.light';
    case 'refund':
      return 'error.light';
    case 'support':
      return 'secondary.light';
    default:
      return 'grey.300';
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          fontSize="small"
          sx={{
            color: star <= rating ? 'warning.main' : 'grey.300',
          }}
        />
      ))}
    </Box>
  );
}

export default function DashboardPage() {
  const { stats, revenueChart, bookingsChart, usersChart, topCategories, topProviders, recentBookings, recentReviews, liveActivities } = dashboardStats;
  const router = useRouter();
  const donutBookingsData = [
    {
      name: 'Completed',
      value: bookingsChart.completed.reduce((a, b) => a + b, 0),
      color: '#388e3c',
    },
    {
      name: 'Cancelled',
      value: bookingsChart.cancelled.reduce((a, b) => a + b, 0),
      color: '#d32f2f',
    },
  ];

  const donutCategoriesData = topCategories.map((cat) => ({
    name: cat.name,
    value: cat.revenue,
  }));

  const totalCompleted = bookingsChart.completed.reduce((a, b) => a + b, 0);
  const totalCancelled = bookingsChart.cancelled.reduce((a, b) => a + b, 0);
  const totalBookings = totalCompleted + totalCancelled;

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatFullCurrency(stats.totalRevenue)}
            icon={<AttachMoney />}
            color="primary"
            change={{ value: 12.5, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            icon={<CalendarMonth />}
            color="success"
            change={{ value: 8.2, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<People />}
            color="info"
            change={{ value: 15.3, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Providers"
            value={stats.totalProviders.toLocaleString()}
            icon={<Engineering />}
            color="warning"
            change={{ value: 5.1, isPositive: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <AreaChart
                title="Revenue Overview"
                data={{
                  labels: revenueChart.labels,
                  datasets: [
                    {
                      name: 'Revenue',
                      data: revenueChart.data,
                      color: '#1976d2',
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <DonutChart
                title="Bookings by Status"
                data={donutBookingsData}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <BarChart
                title="User Growth"
                data={{
                  labels: usersChart.labels,
                  datasets: [
                    {
                      name: 'New Users',
                      data: usersChart.newUsers,
                      color: '#1976d2',
                    },
                    {
                      name: 'Active Users',
                      data: usersChart.activeUsers,
                      color: '#388e3c',
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <DonutChart
                title="Top Categories"
                data={donutCategoriesData}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Recent Bookings
                </Typography>
              }
              action={
                <IconButton
                  component={Link}
                  href="/bookings"
                  size="small"
                  sx={{ color: 'primary.main' }}
                >
                  <ArrowForward />
                </IconButton>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Booking #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      // <TableRow
                      //   key={booking.id}
                      //   component={Link}
                      //   href={`/bookings/${booking.id}`}
                      //   sx={{
                      //     cursor: 'pointer',
                      //     '&:hover': { bgcolor: 'action.hover' },
                      //   }}
                      // >

                      <TableRow
                        key={booking.id}
                        hover
                        tabIndex={0}
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            router.push(`/bookings/${booking.id}`);
                          }
                        }}
                        sx={{
                          cursor: 'pointer',

                          '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                            outlineOffset: '-2px',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500} color="primary.main">
                            {booking.bookingNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{booking.customerName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{booking.providerName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                            {booking.service}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {formatFullCurrency(booking.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={booking.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(booking.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Top Providers
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <List disablePadding>
                {topProviders.map((provider, index) => (
                  <React.Fragment key={index}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          {provider.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {provider.name}
                          </Typography>
                        }
                        // secondary={
                        //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                        //     <Star fontSize="small" sx={{ color: 'warning.main', fontSize: 14 }} />
                        //     <Typography variant="caption" fontWeight={500}>
                        //       {provider.rating}
                        //     </Typography>
                        //     <Typography variant="caption" color="text.secondary">
                        //       &middot; {provider.bookings.toLocaleString()} bookings
                        //     </Typography>
                        //   </Box>
                        // }
                        secondary={
                          <Box
                            component="div"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.25,
                            }}
                          >
                            <Star
                              fontSize="small"
                              sx={{
                                color: 'warning.main',
                                fontSize: 14,
                              }}
                            />

                            <Typography
                              component="span"
                              variant="caption"
                              fontWeight={500}
                            >
                              {provider.rating}
                            </Typography>

                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              &middot; {provider.bookings.toLocaleString()} bookings
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatCurrency(provider.earnings)}
                      </Typography>
                    </ListItem>
                    {index < topProviders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Recent Reviews
                </Typography>
              }
              action={
                <IconButton
                  component={Link}
                  href="/reviews"
                  size="small"
                  sx={{ color: 'primary.main' }}
                >
                  <ArrowForward />
                </IconButton>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <List disablePadding>
                {recentReviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'grey.200',
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          {review.customerName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              fontWeight={600}
                            >
                              {review.customerName}
                            </Typography>

                            <StarRating rating={review.rating} />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {review.service} &middot; {review.providerName}
                            </Typography>

                            <Typography
                              component="p"
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                mb: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              &quot;{review.comment}&quot;
                            </Typography>

                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                display: 'block',
                              }}
                            >
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentReviews.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Live Activity
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                        '100%': { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                </Box>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <List disablePadding>
                {liveActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 48 }}>
                        <Avatar
                          sx={{
                            bgcolor: getActivityAvatarBg(activity.type),
                            width: 36,
                            height: 36,
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < liveActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Pending Requests
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h2" fontWeight={700} color="warning.main">
                  {stats.pendingBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Bookings
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Active Services</Typography>
                        <Chip label={stats.activeServices} size="small" color="success" variant="outlined" />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Today&apos;s Bookings</Typography>
                        <Chip label={stats.todayBookings} size="small" color="info" variant="outlined" />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Today&apos;s Revenue</Typography>
                        <Chip label={formatFullCurrency(stats.todayRevenue)} size="small" color="primary" variant="outlined" />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Completion Rate</Typography>
                        <Chip
                          label={`${((totalCompleted / totalBookings) * 100).toFixed(1)}%`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Cancellation Rate</Typography>
                        <Chip
                          label={`${((totalCancelled / totalBookings) * 100).toFixed(1)}%`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
