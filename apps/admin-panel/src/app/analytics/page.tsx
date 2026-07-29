'use client';

import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  CalendarMonth,
  People,
  Engineering,
  AttachMoney,
  ShowChart,
  Speed,
  Refresh,
} from '@mui/icons-material';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import AreaChart from '@/components/charts/AreaChart';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import { dashboardStats } from '@/data/dashboard';
import { dummyBookings } from '@/data/bookings';
import { dummyPayments } from '@/data/payments';
import { dummyUsers } from '@/data/users';
import { dummyProviders } from '@/data/providers';
import { dummyServices } from '@/data/services';
import { dummyCities } from '@/data/cities';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
  const loading = false;

  const revenueGrowth = useMemo(() => {
    const data = dashboardStats.revenueChart.data;
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    return ((current - previous) / previous * 100).toFixed(1);
  }, []);

  const bookingsGrowth = useMemo(() => {
    const completed = dashboardStats.bookingsChart.completed;
    const current = completed[completed.length - 1];
    const previous = completed[completed.length - 2];
    return ((current - previous) / previous * 100).toFixed(1);
  }, []);

  const avgOrderValue = useMemo(() => {
    const paidPayments = dummyPayments.filter((p) => p.status === 'paid');
    const total = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    return (total / Math.max(paidPayments.length, 1)).toFixed(0);
  }, []);

  const bookingDistribution = useMemo(() => {
    const completed = dummyBookings.filter((b) => b.status === 'completed').length;
    const pending = dummyBookings.filter((b) => b.status === 'pending').length;
    const confirmed = dummyBookings.filter((b) => b.status === 'confirmed').length;
    const inProgress = dummyBookings.filter((b) => b.status === 'in_progress').length;
    const cancelled = dummyBookings.filter((b) => b.status === 'cancelled').length;
    const disputed = dummyBookings.filter((b) => b.status === 'disputed').length;
    const refunded = dummyBookings.filter((b) => b.status === 'refunded').length;
    return [
      { name: 'Completed', value: completed, color: '#388e3c' },
      { name: 'Pending', value: pending, color: '#f57c00' },
      { name: 'Confirmed', value: confirmed, color: '#1976d2' },
      { name: 'In Progress', value: inProgress, color: '#7b1fa2' },
      { name: 'Cancelled', value: cancelled, color: '#d32f2f' },
      { name: 'Disputed', value: disputed, color: '#ff9800' },
      { name: 'Refunded', value: refunded, color: '#607d8b' },
    ].filter((d) => d.value > 0);
  }, []);

  const userSegments = useMemo(() => {
    const roleCounts: Record<string, number> = {};
    dummyUsers.forEach((u) => {
      roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    });
    const colors: Record<string, string> = {
      super_admin: '#d32f2f',
      admin: '#1976d2',
      moderator: '#7b1fa2',
      support_agent: '#388e3c',
    };
    return Object.entries(roleCounts).map(([role, count]) => ({
      name: role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
      color: colors[role] || '#607d8b',
    }));
  }, []);

  const topServices = useMemo(() => {
    return [...dummyServices]
      .filter((s) => s.totalBookings > 0)
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, 8);
  }, []);

  const geographicDistribution = useMemo(() => {
    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
      '#00838f', '#c2185b', '#455a64', '#ff9800', '#607d8b',
    ];
    return dummyCities.map((city, i) => ({
      name: city.name,
      value: city.providerCount,
      color: colors[i % colors.length],
    }));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <PageHeader title="Analytics" subtitle="Platform analytics and insights" />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        subtitle="Platform analytics and insights"
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Revenue Growth"
            value={`+${revenueGrowth}%`}
            icon={<TrendingUp />}
            color="success"
            change={{ value: parseFloat(revenueGrowth), isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Bookings Growth"
            value={`+${bookingsGrowth}%`}
            icon={<CalendarMonth />}
            color="primary"
            change={{ value: parseFloat(bookingsGrowth), isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="User Retention"
            value="78%"
            icon={<People />}
            color="info"
            change={{ value: 3.2, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Provider Satisfaction"
            value="4.6/5"
            icon={<Engineering />}
            color="warning"
            change={{ value: 1.8, isPositive: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <AreaChart
                title="Revenue Trend"
                data={{
                  labels: dashboardStats.revenueChart.labels,
                  datasets: [
                    {
                      name: 'Revenue',
                      data: dashboardStats.revenueChart.data,
                      color: '#1976d2',
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <DonutChart
                title="Booking Distribution"
                data={bookingDistribution}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <DonutChart
                title="User Segments"
                data={userSegments}
                height={280}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Key Metrics
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    icon: <Speed />,
                    label: 'Conversion Rate',
                    value: '4.2%',
                    color: '#1976d2',
                  },
                  {
                    icon: <AttachMoney />,
                    label: 'Average Order Value',
                    value: `$${avgOrderValue}`,
                    color: '#388e3c',
                  },
                  {
                    icon: <Refresh />,
                    label: 'Customer Retention',
                    value: '78%',
                    color: '#7b1fa2',
                  },
                  {
                    icon: <ShowChart />,
                    label: 'Provider Retention',
                    value: '92%',
                    color: '#00838f',
                  },
                ].map((metric) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={metric.label}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: `${metric.color}15`,
                          color: metric.color,
                          display: 'flex',
                        }}
                      >
                        {metric.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.label}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {metric.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Performing Services
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Category
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Bookings
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Rating
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Price
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {service.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.provider}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={service.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          {service.totalBookings}
                        </TableCell>
                        <TableCell align="right">
                          {service.rating > 0 ? service.rating : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          ${service.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <DonutChart
                title="Geographic Distribution"
                data={geographicDistribution}
                height={320}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
