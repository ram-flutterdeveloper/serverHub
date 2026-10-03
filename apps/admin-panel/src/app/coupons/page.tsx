'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalOffer,
  ToggleOn,
  ToggleOff,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyCoupons } from '@/data/coupons';
import { Coupon, CouponType } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import { z } from 'zod';

const couponFormSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters'),
  type: z.string().min(1, 'Coupon type is required'),
  value: z.coerce.number().min(1, 'Value must be at least 1'),
  minOrderAmount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

const typeOptions = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(dummyCoupons);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      usageLimit: 0,
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const filtered = useMemo(() => {
    if (!search) return coupons;
    const q = search.toLowerCase();
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  const stats = useMemo(() => {
    const today = dayjs();
    return {
      total: coupons.length,
      active: coupons.filter((c) => c.isActive).length,
      expired: coupons.filter((c) => dayjs(c.endDate).isBefore(today)).length,
      totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0),
    };
  }, [coupons]);

  const handleOpenCreate = () => {
    setSelectedCoupon(null);
    reset({
      code: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      usageLimit: 0,
      startDate: '',
      endDate: '',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      usageLimit: coupon.usageLimit,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      description: coupon.description,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CouponFormValues) => {
    if (selectedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === selectedCoupon.id
            ? {
                ...c,
                code: data.code,
                type: data.type as CouponType,
                value: data.value,
                minOrderAmount: data.minOrderAmount ?? 0,
                usageLimit: data.usageLimit ?? 0,
                startDate: data.startDate,
                endDate: data.endDate,
                description: data.description || c.description,
              }
            : c
        )
      );
      setSnackbar({ open: true, message: 'Coupon updated successfully', severity: 'success' });
    } else {
      const newCoupon: Coupon = {
        id: `cnp_${String(coupons.length + 1).padStart(3, '0')}`,
        code: data.code,
        description: data.description || '',
        type: data.type as CouponType,
        value: data.value,
        minOrderAmount: data.minOrderAmount ?? 0,
        usageLimit: data.usageLimit ?? 0,
        usedCount: 0,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: true,
      };
      setCoupons((prev) => [...prev, newCoupon]);
      setSnackbar({ open: true, message: 'Coupon created successfully', severity: 'success' });
    }
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCoupon) {
      setCoupons((prev) => prev.filter((c) => c.id !== selectedCoupon.id));
      setDeleteDialogOpen(false);
      setSelectedCoupon(null);
      setSnackbar({ open: true, message: 'Coupon deleted successfully', severity: 'success' });
    }
  };

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const isExpired = (endDate: string) => dayjs(endDate).isBefore(dayjs());

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
          {row.code}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Chip
          label={row.type === CouponType.PERCENTAGE ? 'Percentage' : 'Fixed'}
          color={row.type === CouponType.PERCENTAGE ? 'primary' : 'secondary'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.type === CouponType.PERCENTAGE ? `${row.value}%` : formatCurrency(row.value)}
        </Typography>
      ),
    },
    {
      field: 'minOrderAmount',
      headerName: 'Min Order',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {row.minOrderAmount > 0 ? formatCurrency(row.minOrderAmount) : '—'}
        </Typography>
      ),
    },
    {
      field: 'usage',
      headerName: 'Usage',
      flex: 1.2,
      minWidth: 160,
      renderCell: ({ row }) => {
        const percentage = row.usageLimit > 0 ? (row.usedCount / row.usageLimit) * 100 : 0;
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {row.usedCount}/{row.usageLimit}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {Math.round(percentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              color={percentage >= 100 ? 'error' : percentage >= 80 ? 'warning' : 'primary'}
            />
          </Box>
        );
      },
    },
    {
      field: 'validity',
      headerName: 'Validity',
      flex: 1.2,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => {
        const expired = isExpired(row.endDate);
        if (expired) return <StatusChip status="inactive" label="Expired" />;
        return <StatusChip status={row.isActive ? 'active' : 'inactive'} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 130,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
            <IconButton
              size="small"
              color={row.isActive ? 'warning' : 'success'}
              onClick={() => handleToggleActive(row.id)}
            >
              {row.isActive ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Coupons"
        subtitle="Manage discount coupons"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Coupon
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Coupons" value={stats.total} icon={<LocalOffer />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active" value={stats.active} icon={<LocalOffer />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Expired" value={stats.expired} icon={<LocalOffer />} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Usage" value={stats.totalUsage.toLocaleString()} icon={<LocalOffer />} color="info" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search coupons by code or description..."
        emptyMessage="No coupons found matching your search."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedCoupon ? 'Edit Coupon' : 'Add Coupon'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedCoupon ? 'Update' : 'Create'}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="code" control={control as Control<CouponFormValues>} label="Coupon Code" required />
          <FormSelect
            name="type"
            control={control as Control<CouponFormValues>}
            label="Coupon Type"
            options={typeOptions}
            required
          />
          <FormTextField name="value" control={control as Control<CouponFormValues>} label="Value" type="number" required />
          <FormTextField name="minOrderAmount" control={control as Control<CouponFormValues>} label="Minimum Order Amount" type="number" />
          <FormTextField name="usageLimit" control={control as Control<CouponFormValues>} label="Usage Limit" type="number" />
          <FormTextField name="startDate" control={control as Control<CouponFormValues>} label="Start Date" type="date" required />
          <FormTextField name="endDate" control={control as Control<CouponFormValues>} label="End Date" type="date" required />
          <FormTextField
            name="description"
            control={control as Control<CouponFormValues>}
            label="Description"
            multiline
            rows={2}
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${selectedCoupon?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedCoupon(null); }}
        severity="error"
      />

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
