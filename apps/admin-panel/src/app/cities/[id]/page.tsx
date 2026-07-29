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
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Business,
  Inventory,
  Map,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyCities } from '@/data/cities';
import { dummyAreas } from '@/data/areas';
import { City } from '@/types';
import { citySchema, CityFormData } from '@/utils/validations';

export default function CityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;

  const [cities, setCities] = useState<City[]>(dummyCities);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const city = useMemo(
    () => cities.find((c) => c.id === cityId),
    [cities, cityId]
  );

  const cityAreas = useMemo(
    () => dummyAreas.filter((a) => a.cityId === cityId),
    [cityId]
  );

  const { control, handleSubmit, reset } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: { name: '', state: '', country: '' },
  });

  const handleEdit = () => {
    if (city) {
      reset({ name: city.name, state: city.state, country: city.country });
      setEditOpen(true);
    }
  };

  const handleFormSubmit = (data: CityFormData) => {
    setCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, ...data } : c))
    );
    setEditOpen(false);
    setSnackbar({ open: true, message: 'City updated successfully', severity: 'success' });
  };

  if (!city) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          City not found
        </Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title={city.name}
        subtitle={`${city.state}, ${city.country}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Cities', path: '/cities' },
          { label: city.name },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/cities')}>
            Back to Cities
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {city.name}
                  </Typography>
                  <StatusChip status={city.isActive ? 'active' : 'inactive'} size="medium" />
                </Box>
                <Tooltip title="Edit City">
                  <IconButton color="primary" onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Map fontSize="small" color="action" />
                    <Typography variant="body2">
                      State: {city.state}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Map fontSize="small" color="action" />
                    <Typography variant="body2">
                      Country: {city.country}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Areas in {city.name}
              </Typography>
              {cityAreas.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No areas found for this city.
                </Typography>
              ) : (
                <List disablePadding>
                  {cityAreas.map((area) => (
                    <ListItem
                      key={area.id}
                      sx={{
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Map fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={area.name}
                        secondary={`${area.providerCount} providers`}
                      />
                      <StatusChip status={area.isActive ? 'active' : 'inactive'} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Statistics
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Providers"
                    secondary={city.providerCount}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'h5', fontWeight: 700, color: 'text.primary' }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Inventory color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Services"
                    secondary={city.serviceCount}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'h5', fontWeight: 700, color: 'text.primary' }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Map color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Areas"
                    secondary={cityAreas.length}
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
                Quick Actions
              </Typography>
              <Button variant="outlined" startIcon={<Edit />} fullWidth onClick={handleEdit}>
                Edit City
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        title="Edit City"
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<any>} label="City Name" required />
          <FormTextField name="state" control={control as Control<any>} label="State" required />
          <FormTextField name="country" control={control as Control<any>} label="Country" required />
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
