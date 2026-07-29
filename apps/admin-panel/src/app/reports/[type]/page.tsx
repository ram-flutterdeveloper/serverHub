'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import {
  Download,
  TableChart,
  PictureAsPdf,
  TrendingUp,
} from '@mui/icons-material';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import AreaChart from '@/components/charts/AreaChart';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import { dashboardStats } from '@/data/dashboard';
import { dummyBookings } from '@/data/bookings';
import { dummyPayments } from '@/data/payments';
import { dummyUsers } from '@/data/users';
import { dummyProviders } from '@/data/providers';
import { dummyReviews } from '@/data/reviews';
import { dummyWalletTransactions } from '@/data/wallets';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const reportTitles: Record<string, string> = {
  revenue: 'Revenue Report',
  providers: 'Provider Report',
  bookings: 'Booking Report',
  customers: 'Customer Report',
  tax: 'Tax Report',
  commission: 'Commission Report',
  wallet: 'Wallet Report',
};

const reportSubtitles: Record<string, string> = {
  revenue: 'Financial performance and revenue analysis',
  providers: 'Provider performance and earnings breakdown',
  bookings: 'Booking volumes, status distribution, and trends',
  customers: 'User acquisition, segments, and engagement',
  tax: 'Tax collection and compliance overview',
  commission: 'Commission earnings and rate analysis',
  wallet: 'Wallet balances, credits, and debits',
};

export default function DynamicReportPage() {
  const params = useParams();
  const type = (params.type as string) || 'revenue';
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2026-07-28');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleExport = (format: string) => {
    setSnackbar({ open: true, message: `Export started (${format} format)` });
  };

  const revenueData = useMemo(() => {
    const totalRevenue = dummyPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const avgRevenue = totalRevenue / Math.max(dummyPayments.length, 1);
    return { totalRevenue, avgRevenue, growth: 15.3 };
  }, []);

  const providerData = useMemo(() => {
    const activeProviders = dummyProviders.filter(
      (p) => p.status === 'approved'
    );
    const avgRating =
      activeProviders.reduce((sum, p) => sum + p.rating, 0) /
      Math.max(activeProviders.length, 1);
    return {
      total: dummyProviders.length,
      active: activeProviders.length,
      avgRating: avgRating.toFixed(1),
    };
  }, []);

  const bookingData = useMemo(() => {
    const completed = dummyBookings.filter(
      (b) => b.status === 'completed'
    ).length;
    const cancelled = dummyBookings.filter(
      (b) => b.status === 'cancelled'
    ).length;
    return {
      total: dummyBookings.length,
      completed,
      cancelled,
    };
  }, []);

  const customerData = useMemo(() => {
    const activeUsers = dummyUsers.filter(
      (u) => u.status === 'active'
    ).length;
    return {
      total: dummyUsers.length,
      active: activeUsers,
      newThisMonth: 820,
    };
  }, []);

  const taxData = useMemo(() => {
    const totalTax = dummyBookings.reduce((sum, b) => sum + b.commission, 0);
    const avgRate = 12;
    return { totalTax, avgRate };
  }, []);

  const commissionData = useMemo(() => {
    const totalCommission = dummyBookings.reduce(
      (sum, b) => sum + b.commission,
      0
    );
    return { totalCommission, avgRate: 12.5 };
  }, []);

  const walletData = useMemo(() => {
    const credits = dummyWalletTransactions
      .filter((t) => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    const debits = dummyWalletTransactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalBalance: credits - debits, credits, debits };
  }, []);

  const renderRevenueReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Revenue"
            value={`$${revenueData.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 15.3, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Average Revenue"
            value={`$${revenueData.avgRevenue.toFixed(0)}`}
            icon={<TrendingUp />}
            color="info"
            change={{ value: 8.7, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Growth Rate"
            value={`${revenueData.growth}%`}
            icon={<TrendingUp />}
            color="success"
            change={{ value: 2.1, isPositive: true }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <AreaChart
            title="Revenue Over Months"
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
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Period Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Revenue
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Transactions
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Avg. Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardStats.revenueChart.labels.map((label, i) => (
                  <TableRow key={label}>
                    <TableCell>{label} 2025</TableCell>
                    <TableCell align="right">
                      ${dashboardStats.revenueChart.data[i].toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {Math.floor(dashboardStats.revenueChart.data[i] / 200)}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {(
                        dashboardStats.revenueChart.data[i] /
                        Math.floor(dashboardStats.revenueChart.data[i] / 200)
                      ).toFixed(0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderProviderReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Providers"
            value={providerData.total}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 12.5, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Average Rating"
            value={providerData.avgRating}
            icon={<TrendingUp />}
            color="success"
            change={{ value: 3.2, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Providers"
            value={providerData.active}
            icon={<TrendingUp />}
            color="info"
            change={{ value: 8.1, isPositive: true }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <BarChart
            title="Top Providers by Earnings"
            data={{
              labels: dashboardStats.topProviders.map((p) =>
                p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name
              ),
              datasets: [
                {
                  name: 'Earnings',
                  data: dashboardStats.topProviders.map((p) => p.earnings),
                  color: '#388e3c',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Provider Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Rating
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Bookings
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Earnings
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.businessName}</TableCell>
                    <TableCell align="right">
                      {provider.rating > 0 ? provider.rating : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {provider.totalBookings.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${provider.totalEarnings.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={provider.status}
                        size="small"
                        color={
                          provider.status === 'approved'
                            ? 'success'
                            : provider.status === 'pending'
                              ? 'warning'
                              : 'error'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderBookingReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Bookings"
            value={bookingData.total}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 18.7, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Completed"
            value={bookingData.completed}
            icon={<TrendingUp />}
            color="success"
            change={{ value: 22.3, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Cancelled"
            value={bookingData.cancelled}
            icon={<TrendingUp />}
            color="error"
            change={{ value: 5.2, isPositive: false }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <BarChart
            title="Bookings Over Months"
            data={{
              labels: dashboardStats.bookingsChart.labels,
              datasets: [
                {
                  name: 'Completed',
                  data: dashboardStats.bookingsChart.completed,
                  color: '#388e3c',
                },
                {
                  name: 'Cancelled',
                  data: dashboardStats.bookingsChart.cancelled,
                  color: '#d32f2f',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Status Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Percentage
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['completed', 'pending', 'confirmed', 'in_progress', 'cancelled', 'disputed', 'refunded'].map(
                  (status) => {
                    const count = dummyBookings.filter(
                      (b) => b.status === status
                    ).length;
                    const value = dummyBookings
                      .filter((b) => b.status === status)
                      .reduce((sum, b) => sum + b.amount, 0);
                    return (
                      <TableRow key={status}>
                        <TableCell>
                          <Chip
                            label={status.replace('_', ' ')}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">{count}</TableCell>
                        <TableCell align="right">
                          {((count / dummyBookings.length) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell align="right">
                          ${value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderCustomerReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Users"
            value={customerData.total}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 14.2, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="New This Month"
            value={customerData.newThisMonth}
            icon={<TrendingUp />}
            color="success"
            change={{ value: 9.8, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Users"
            value={customerData.active}
            icon={<TrendingUp />}
            color="info"
            change={{ value: 6.5, isPositive: true }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <LineChart
            title="User Growth Over Months"
            data={{
              labels: dashboardStats.usersChart.labels,
              datasets: [
                {
                  name: 'New Users',
                  data: dashboardStats.usersChart.newUsers,
                  color: '#f57c00',
                },
                {
                  name: 'Active Users',
                  data: dashboardStats.usersChart.activeUsers,
                  color: '#1976d2',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            User Segments
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Percentage
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Avg. City
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['admin', 'moderator', 'support_agent', 'super_admin'].map(
                  (role) => {
                    const roleUsers = dummyUsers.filter(
                      (u) => u.role === role
                    );
                    const topCity =
                      roleUsers.length > 0
                        ? roleUsers.reduce((a, b) =>
                            (a.city || '').localeCompare(b.city || '') < 0
                              ? a
                              : b
                          ).city
                        : 'N/A';
                    return (
                      <TableRow key={role}>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {role.replace('_', ' ')}
                        </TableCell>
                        <TableCell align="right">
                          {roleUsers.length}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            (roleUsers.length / dummyUsers.length) *
                            100
                          ).toFixed(1)}
                          %
                        </TableCell>
                        <TableCell align="right">{topCity}</TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderTaxReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Tax Collected"
            value={`$${taxData.totalTax.toLocaleString()}`}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 11.4, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Average Rate"
            value={`${taxData.avgRate}%`}
            icon={<TrendingUp />}
            color="info"
            change={{ value: 0, isPositive: true }}
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <AreaChart
            title="Tax Collection Over Months"
            data={{
              labels: monthLabels,
              datasets: [
                {
                  name: 'Tax Collected',
                  data: [
                    3900, 4580, 5050, 4780, 5470, 5790, 6290, 5890, 6140,
                    6700, 7070, 7480,
                  ],
                  color: '#d32f2f',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </>
  );

  const renderCommissionReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Commission"
            value={`$${commissionData.totalCommission.toLocaleString()}`}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 13.8, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Average Rate"
            value={`${commissionData.avgRate}%`}
            icon={<TrendingUp />}
            color="info"
            change={{ value: 0.5, isPositive: true }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <BarChart
            title="Commission by Category"
            data={{
              labels: dashboardStats.topCategories.map((c) => c.name),
              datasets: [
                {
                  name: 'Commission',
                  data: dashboardStats.topCategories.map(
                    (c) => Math.round(c.revenue * 0.12)
                  ),
                  color: '#00838f',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Commission by Booking
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Booking</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Commission
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Rate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyBookings
                  .filter((b) => b.commission > 0)
                  .slice(0, 10)
                  .map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.bookingNumber}</TableCell>
                      <TableCell align="right">
                        ${b.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${b.commission.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {((b.commission / b.amount) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderWalletReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Balance"
            value={`$${walletData.totalBalance.toLocaleString()}`}
            icon={<TrendingUp />}
            color="primary"
            change={{ value: 22.1, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Credits"
            value={`$${walletData.credits.toLocaleString()}`}
            icon={<TrendingUp />}
            color="success"
            change={{ value: 18.6, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Debits"
            value={`$${walletData.debits.toLocaleString()}`}
            icon={<TrendingUp />}
            color="warning"
            change={{ value: 7.3, isPositive: false }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <LineChart
            title="Wallet Transactions Over Time"
            data={{
              labels: monthLabels,
              datasets: [
                {
                  name: 'Credits',
                  data: [820, 512, 2520, 1200, 2318, 5311, 1758, 625, 405, 0, 0, 0],
                  color: '#388e3c',
                },
                {
                  name: 'Debits',
                  data: [0, 160, 50, 200, 500, 400, 800, 300, 300, 84, 0, 0],
                  color: '#d32f2f',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Transactions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Balance
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyWalletTransactions.slice(0, 12).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.ownerName}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={tx.type}
                        size="small"
                        color={tx.type === 'credit' ? 'success' : 'warning'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${tx.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderContent = () => {
    switch (type) {
      case 'revenue':
        return renderRevenueReport();
      case 'providers':
        return renderProviderReport();
      case 'bookings':
        return renderBookingReport();
      case 'customers':
        return renderCustomerReport();
      case 'tax':
        return renderTaxReport();
      case 'commission':
        return renderCommissionReport();
      case 'wallet':
        return renderWalletReport();
      default:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" textAlign="center" py={4}>
                Report type not found
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={reportTitles[type] || 'Report'}
        subtitle={reportSubtitles[type] || ''}
        breadcrumbs={[
          { label: 'Reports', path: '/reports' },
          { label: reportTitles[type] || type },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('CSV')}
              size="small"
            >
              CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<TableChart />}
              onClick={() => handleExport('Excel')}
              size="small"
            >
              Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={() => handleExport('PDF')}
              size="small"
            >
              PDF
            </Button>
          </Box>
        }
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <Button variant="contained" size="small">
              Apply Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {renderContent()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: '' })}
          severity="success"
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
