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
  Snackbar,
  Alert,
  Stack,
  Rating,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  CalendarToday,
  Category,
  Engineering,
  LocationOn,
  AttachMoney,
  Star,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyServices } from '@/data/services';
import { Service, ServiceStatus } from '@/types';
import { serviceSchema, ServiceFormData } from '@/utils/validations';
import { formatDate, formatCurrency } from '@/utils';

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [services, setServices] = useState<Service[]>(dummyServices);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const service = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  const { control, handleSubmit, reset } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: '', description: '', categoryId: '', price: 0, priceType: 'fixed' },
  });

  const handleEdit = () => {
    if (service) {
      reset({
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        price: service.price,
        priceType: service.priceType,
      });
      setEditOpen(true);
    }
  };

  const handleFormSubmit = (data: ServiceFormData) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              title: data.title,
              description: data.description,
              categoryId: data.categoryId,
              price: data.price,
              priceType: data.priceType as 'fixed' | 'hourly' | 'starting_at',
            }
          : s
      )
    );
    setEditOpen(false);
    setSnackbar({ open: true, message: 'Service updated successfully', severity: 'success' });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
    router.push('/services');
  };

  if (!service) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Service not found
        </Typography>
      </AdminLayout>
    );
  }

  const infoItems = [
    { icon: <Category />, text: 'Category', value: service.category },
    { icon: <Engineering />, text: 'Provider', value: service.provider },
    { icon: <LocationOn />, text: 'City', value: service.city },
    { icon: <CalendarToday />, text: 'Created', value: formatDate(service.createdAt) },
    { icon: <AttachMoney />, text: 'Price', value: `${formatCurrency(service.price)} / ${service.priceType}` },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={service.title}
        subtitle={service.description}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Services', path: '/services' },
          { label: service.title },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/services')}>
            Back to Services
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                  {service.title}
                </Typography>
                <StatusChip status={service.status} size="medium" />
                {service.isFeatured && (
                  <StatusChip status="active" label="Featured" size="medium" />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {service.description}
              </Typography>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Service Details
              </Typography>
              <List disablePadding>
                {infoItems.map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      secondary={item.value}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button variant="outlined" startIcon={<Edit />} fullWidth onClick={handleEdit}>
                  Edit Service
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  fullWidth
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Service
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {service.totalBookings}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        {service.rating}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Pricing
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {formatCurrency(service.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.priceType.replace(/_/g, ' ')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        title="Edit Service"
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="title" control={control as Control<any>} label="Service Title" required />
          <FormTextField name="description" control={control as Control<any>} label="Description" multiline rows={3} required />
          <FormTextField name="price" control={control as Control<any>} label="Price ($)" type="number" required />
          <FormTextField name="priceType" control={control as Control<any>} label="Price Type (fixed/hourly/starting_at)" required />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Service"
        message={`Are you sure you want to delete "${service.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
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
