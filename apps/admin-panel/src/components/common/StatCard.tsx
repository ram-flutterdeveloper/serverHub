'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  Avatar,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  change?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const colorMap = {
  primary: { bg: 'primary.light', color: 'primary.main' },
  success: { bg: 'success.light', color: 'success.main' },
  warning: { bg: 'warning.light', color: 'warning.main' },
  error: { bg: 'error.light', color: 'error.main' },
  info: { bg: 'info.light', color: 'info.main' },
};

export default function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  change,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const colors = colorMap[color];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: colors.bg,
              color: colors.color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Box>
        {change && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 2,
              color: change.isPositive ? 'success.main' : 'error.main',
            }}
          >
            {change.isPositive ? (
              <TrendingUp fontSize="small" />
            ) : (
              <TrendingDown fontSize="small" />
            )}
            <Typography variant="body2" fontWeight={600}>
              {change.isPositive ? '+' : ''}
              {change.value}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
