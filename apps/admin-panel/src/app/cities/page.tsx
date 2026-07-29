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
  Switch,
  Button,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Map,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyCities } from '@/data/cities';
import { City } from '@/types';
import { citySchema, CityFormData } from '@/utils/validations';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>(dummyCities);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: { name: '', state: '', country: '' },
  });

  const filtered = useMemo(() => {
    if (!search) return cities;
    const q = search.toLowerCase();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [cities, search]);

  const stats = useMemo(() => ({
    total: cities.length,
    active: cities.filter((c) => c.isActive).length,
  }), [cities]);

  const handleOpenCreate = () => {
    setSelectedCity(null);
    reset({ name: '', state: '', country: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (city: City) => {
    setSelectedCity(city);
    reset({ name: city.name, state: city.state, country: city.country });
    setDialogOpen(true);
  };

  const handleOpenDelete = (city: City) => {
    setSelectedCity(city);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CityFormData) => {
    if (selectedCity) {
      setCities((prev) =>
        prev.map((c) =>
          c.id === selectedCity.id ? { ...c, ...data } : c
        )
      );
      setSnackbar({ open: true, message: 'City updated successfully', severity: 'success' });
    } else {
      const newCity: City = {
        id: `city_${String(cities.length + 1).padStart(3, '0')}`,
        name: data.name,
        state: data.state,
        country: data.country,
        isActive: true,
        providerCount: 0,
        serviceCount: 0,
      };
      setCities((prev) => [...prev, newCity]);
      setSnackbar({ open: true, message: 'City created successfully', severity: 'success' });
    }
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCity) {
      setCities((prev) => prev.filter((c) => c.id !== selectedCity.id));
      setDeleteDialogOpen(false);
      setSelectedCity(null);
      setSnackbar({ open: true, message: 'City deleted successfully', severity: 'success' });
    }
  };

  const handleToggleActive = (id: string) => {
    setCities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'City Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    { field: 'state', headerName: 'State', flex: 1, minWidth: 130 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 130 },
    {
      field: 'providerCount',
      headerName: 'Providers',
      flex: 0.7,
      minWidth: 90,
      type: 'number',
    },
    {
      field: 'serviceCount',
      headerName: 'Services',
      flex: 0.7,
      minWidth: 90,
      type: 'number',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Switch
            size="small"
            checked={row.isActive}
            onChange={() => handleToggleActive(row.id)}
            color="primary"
          />
          <StatusChip status={row.isActive ? 'active' : 'inactive'} />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
              <Edit fontSize="small" />
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
        title="Cities"
        subtitle="Manage service cities"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add City
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard title="Total Cities" value={stats.total} icon={<Map />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard title="Active Cities" value={stats.active} icon={<Map />} color="success" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search cities by name, state, country..."
        emptyMessage="No cities found matching your search."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedCity ? 'Edit City' : 'Add City'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedCity ? 'Update' : 'Create'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<any>} label="City Name" required />
          <FormTextField name="state" control={control as Control<any>} label="State" required />
          <FormTextField name="country" control={control as Control<any>} label="Country" required />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete City"
        message={`Are you sure you want to delete "${selectedCity?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedCity(null); }}
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
