'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import {
  AttachMoney,
  Engineering,
  CalendarMonth,
  People,
  ReceiptLong,
  AccountBalance,
  AccountBalanceWallet,
  ArrowForward,
} from '@mui/icons-material';
import NextLink from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';

interface ReportType {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  href: string;
}

const reportTypes: ReportType[] = [
  {
    title: 'Revenue Report',
    description: 'Track total revenue, average order value, growth trends, and financial performance across all services.',
    icon: <AttachMoney />,
    color: '#1976d2',
    bgColor: '#e3f2fd',
    href: '/reports/revenue',
  },
  {
    title: 'Provider Report',
    description: 'Analyze provider performance, ratings, earnings distribution, and active provider metrics.',
    icon: <Engineering />,
    color: '#388e3c',
    bgColor: '#e8f5e9',
    href: '/reports/providers',
  },
  {
    title: 'Booking Report',
    description: 'Monitor booking volumes, completion rates, cancellation patterns, and scheduling trends.',
    icon: <CalendarMonth />,
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    href: '/reports/bookings',
  },
  {
    title: 'Customer Report',
    description: 'Understand user acquisition, retention rates, demographic distribution, and engagement metrics.',
    icon: <People />,
    color: '#f57c00',
    bgColor: '#fff3e0',
    href: '/reports/customers',
  },
  {
    title: 'Tax Report',
    description: 'View tax collection summaries, applicable rates, and compliance reporting for all transactions.',
    icon: <ReceiptLong />,
    color: '#d32f2f',
    bgColor: '#ffebee',
    href: '/reports/tax',
  },
  {
    title: 'Commission Report',
    description: 'Track commission earnings, rate breakdowns by category, and provider commission distributions.',
    icon: <AccountBalance />,
    color: '#00838f',
    bgColor: '#e0f7fa',
    href: '/reports/commission',
  },
  {
    title: 'Wallet Report',
    description: 'Monitor wallet balances, credit/debit flows, top-up patterns, and withdrawal activities.',
    icon: <AccountBalanceWallet />,
    color: '#3949ab',
    bgColor: '#e8eaf6',
    href: '/reports/wallet',
  },
];

export default function ReportsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Reports"
        subtitle="Business intelligence and analytics"
      />
      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={report.title}>
            <Card
              component={NextLink}
              href={report.href}
              sx={{
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  borderColor: report.color,
                  borderWidth: 2,
                  borderStyle: 'solid',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: report.bgColor,
                      color: report.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {report.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {report.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {report.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    sx={{
                      color: report.color,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: report.bgColor },
                    }}
                    endIcon={<ArrowForward />}
                  >
                    View Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}
