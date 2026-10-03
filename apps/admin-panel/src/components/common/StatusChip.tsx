'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string;
  label?: string;
  size?: 'small' | 'medium';
}

const colorMap: Record<string, ChipProps['color']> = {
  /* legacy lowercase statuses */
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

  /* backend enums */
  approved: 'success',
  paid: 'success',
  resolved: 'success',
  blocked: 'error',
  deleted: 'default',
  confirmed: 'info',
  provider_assigned: 'info',
  provider_accepted: 'info',
  provider_rejected: 'error',
  on_the_way: 'warning',
  arrived: 'warning',
  working: 'warning',
  started: 'warning',
  waiting: 'warning',
  closed: 'default',
  online: 'info',
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
