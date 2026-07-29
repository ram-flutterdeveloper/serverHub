'use client';

import React from 'react';
import BaseConfirmDialog from '../common/ConfirmDialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'error' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
  severity = 'warning',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <BaseConfirmDialog
      open={open}
      title={title}
      message={message}
      confirmText={confirmText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      severity={severity}
      loading={loading}
    />
  );
}
