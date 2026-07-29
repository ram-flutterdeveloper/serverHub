'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  LocalOffer,
  CalendarToday,
  BarChart,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
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

export default function CouponDetailPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const [coupons, setCoupons] = useState<Coupon[]>(dummyCoupons);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const coupon = useMemo(
    () => coupons.find((c) => c.id === couponId),
    [coupons, couponId]
  );

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

  const handleEdit = () => {
    if (coupon) {
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
      setEditOpen(true);
    }
  };

  const handleFormSubmit = (data: CouponFormValues) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId
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
    setEditOpen(false);
    setSnackbar({ open: true, message: 'Coupon updated successfully', severity: 'success' });
  };

  if (!coupon) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Coupon not found
        </Typography>
      </AdminLayout>
    );
  }

  const today = dayjs();
  const expired = dayjs(coupon.endDate).isBefore(today);
  const usagePercentage = coupon.usageLimit > 0 ? (coupon.usedCount / coupon.usageLimit) * 100 : 0;
  const remaining = coupon.usageLimit - coupon.usedCount;

  return (
    <AdminLayout>
      <PageHeader
        title={`Coupon: ${coupon.code}`}
        subtitle={coupon.description}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Coupons', path: '/coupons' },
          { label: coupon.code },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/coupons')}>
            Back to Coupons
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    {coupon.code}
                  </Typography>
                  <Chip
                    label={coupon.type === CouponType.PERCENTAGE ? 'Percentage' : 'Fixed'}
                    color={coupon.type === CouponType.PERCENTAGE ? 'primary' : 'secondary'}
                    size="small"
                  />
                  {expired ? (
                    <StatusChip status="inactive" label="Expired" size="medium" />
                  ) : (
                    <StatusChip status={coupon.isActive ? 'active' : 'inactive'} size="medium" />
                  )}
                </Box>
                <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
                  Edit
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {coupon.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOffer fontSize="small" color="action" />
                    <Typography variant="body2">
                      Discount: <strong>{coupon.type === CouponType.PERCENTAGE ? `${coupon.value}%` : formatCurrency(coupon.value)}</strong>
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOffer fontSize="small" color="action" />
                    <Typography variant="body2">
                      Min. Order: <strong>{coupon.minOrderAmount > 0 ? formatCurrency(coupon.minOrderAmount) : 'None'}</strong>
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">
                      Start: <strong>{formatDate(coupon.startDate)}</strong>
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">
                      End: <strong>{formatDate(coupon.endDate)}</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Usage Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Usage Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round(usagePercentage)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(usagePercentage, 100)}
                  color={usagePercentage >= 100 ? 'error' : usagePercentage >= 80 ? 'warning' : 'primary'}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <BarChart color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Used"
                    secondary={coupon.usedCount.toLocaleString()}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'h5', fontWeight: 700, color: 'text.primary' }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Remaining"
                    secondary={remaining > 0 ? remaining.toLocaleString() : 'Limit reached'}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'h5', fontWeight: 700, color: remaining > 0 ? 'text.primary' : 'error.main' }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocalOffer color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Limit"
                    secondary={coupon.usageLimit.toLocaleString()}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'h5', fontWeight: 700, color: 'text.primary' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Validity
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Start Date"
                    secondary={formatDate(coupon.startDate)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="End Date"
                    secondary={formatDate(coupon.endDate)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {expired ? <Cancel color="error" /> : <CheckCircle color="success" />}
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        title="Edit Coupon"
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="code" control={control as Control<any>} label="Coupon Code" required />
          <FormSelect
            name="type"
            control={control as Control<any>}
            label="Coupon Type"
            options={typeOptions}
            required
          />
          <FormTextField name="value" control={control as Control<any>} label="Value" type="number" required />
          <FormTextField name="minOrderAmount" control={control as Control<any>} label="Minimum Order Amount" type="number" />
          <FormTextField name="usageLimit" control={control as Control<any>} label="Usage Limit" type="number" />
          <FormTextField name="startDate" control={control as Control<any>} label="Start Date" type="date" required />
          <FormTextField name="endDate" control={control as Control<any>} label="End Date" type="date" required />
          <FormTextField
            name="description"
            control={control as Control<any>}
            label="Description"
            multiline
            rows={2}
          />
        </Box>
      </FormDialog>

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
