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
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Business,
  Map,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyAreas } from '@/data/areas';
import { dummyCities } from '@/data/cities';
import { Area } from '@/types';
import { areaSchema, AreaFormData } from '@/utils/validations';

const cityOptions = dummyCities.map((c) => ({ value: c.id, label: c.name }));

export default function AreaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const areaId = params.id as string;

  const [areas, setAreas] = useState<Area[]>(dummyAreas);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const area = useMemo(
    () => areas.find((a) => a.id === areaId),
    [areas, areaId]
  );

  const parentCity = useMemo(
    () => area ? dummyCities.find((c) => c.id === area.cityId) : null,
    [area]
  );

  const { control, handleSubmit, reset } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { name: '', cityId: '' },
  });

  const handleEdit = () => {
    if (area) {
      reset({ name: area.name, cityId: area.cityId });
      setEditOpen(true);
    }
  };

  const handleFormSubmit = (data: AreaFormData) => {
    const cityName = dummyCities.find((c) => c.id === data.cityId)?.name || '';
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, name: data.name, cityId: data.cityId, cityName } : a))
    );
    setEditOpen(false);
    setSnackbar({ open: true, message: 'Area updated successfully', severity: 'success' });
  };

  if (!area) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Area not found
        </Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title={area.name}
        subtitle={`Area in ${area.cityName}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Areas', path: '/areas' },
          { label: area.name },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/areas')}>
            Back to Areas
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
                    {area.name}
                  </Typography>
                  <StatusChip status={area.isActive ? 'active' : 'inactive'} size="medium" />
                </Box>
                <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
                  Edit Area
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Map fontSize="small" color="action" />
                    <Typography variant="body2">
                      City:{' '}
                      <Link
                        href={`/cities/${area.cityId}`}
                        style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        {area.cityName}
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2">
                      Providers: {area.providerCount}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {parentCity && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  City Information
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Map color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="City"
                      secondary={parentCity.name}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Map color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="State"
                      secondary={parentCity.state}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Map color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Country"
                      secondary={parentCity.country}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          )}
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
                    secondary={area.providerCount}
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
                    primary="Status"
                    secondary={area.isActive ? 'Active' : 'Inactive'}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        title="Edit Area"
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<AreaFormData>} label="Area Name" required />
          <FormSelect
            name="cityId"
            control={control as Control<AreaFormData>}
            label="City"
            options={cityOptions}
            required
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
