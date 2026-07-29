'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string;
  label?: string;
  size?: 'small' | 'medium';
}

const colorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  success: 'success',
  completed: 'success',
  verified: 'success',
  inactive: 'warning',
  pending: 'warning',
  suspended: 'error',
  rejected: 'error',
  cancelled: 'error',
  failed: 'error',
  draft: 'default',
  open: 'info',
};

export default function StatusChip({ status, label, size = 'small' }: StatusChipProps) {
  const normalized = status.toLowerCase().trim();
  const color = colorMap[normalized] || 'default';

  return (
    <Chip
      label={label || status}
      color={color}
      size={size}
      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
    />
  );
}
