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
import FormSelect from '@/components/forms/FormSelect';
import { dummyAreas } from '@/data/areas';
import { dummyCities } from '@/data/cities';
import { Area } from '@/types';
import { areaSchema, AreaFormData } from '@/utils/validations';

const cityOptions = dummyCities.map((c) => ({ value: c.id, label: c.name }));

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>(dummyAreas);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { name: '', cityId: '' },
  });

  const filtered = useMemo(() => {
    let result = areas;
    if (cityFilter) {
      result = result.filter((a) => a.cityId === cityFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.cityName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [areas, search, cityFilter]);

  const stats = useMemo(() => ({
    total: areas.length,
    active: areas.filter((a) => a.isActive).length,
  }), [areas]);

  const handleOpenCreate = () => {
    setSelectedArea(null);
    reset({ name: '', cityId: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (area: Area) => {
    setSelectedArea(area);
    reset({ name: area.name, cityId: area.cityId });
    setDialogOpen(true);
  };

  const handleOpenDelete = (area: Area) => {
    setSelectedArea(area);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: AreaFormData) => {
    const cityName = dummyCities.find((c) => c.id === data.cityId)?.name || '';
    if (selectedArea) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === selectedArea.id ? { ...a, name: data.name, cityId: data.cityId, cityName } : a
        )
      );
      setSnackbar({ open: true, message: 'Area updated successfully', severity: 'success' });
    } else {
      const newArea: Area = {
        id: `area_${String(areas.length + 1).padStart(3, '0')}`,
        name: data.name,
        cityId: data.cityId,
        cityName,
        isActive: true,
        providerCount: 0,
      };
      setAreas((prev) => [...prev, newArea]);
      setSnackbar({ open: true, message: 'Area created successfully', severity: 'success' });
    }
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedArea) {
      setAreas((prev) => prev.filter((a) => a.id !== selectedArea.id));
      setDeleteDialogOpen(false);
      setSelectedArea(null);
      setSnackbar({ open: true, message: 'Area deleted successfully', severity: 'success' });
    }
  };

  const handleToggleActive = (id: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Area Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'cityName',
      headerName: 'City',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'providerCount',
      headerName: 'Providers',
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
        title="Areas"
        subtitle="Manage service areas"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Area
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard title="Total Areas" value={stats.total} icon={<Map />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard title="Active Areas" value={stats.active} icon={<Map />} color="success" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search areas by name or city..."
        toolbar={
          // <FormSelect
          //   name="cityFilter"
          //   control={{ _formValues: {}, _defaultValues: {}, _fieldValues: {} } as any}
          //   label="City"
          //   options={[{ value: '', label: 'All Cities' }, ...cityOptions]}
          //   fullWidth={false}
          // />
          <FormSelect
            label="City"
            options={[{ value: '', label: 'All Cities' }, ...cityOptions]}
            value={cityFilter}
            onChange={(value) => {
              setCityFilter(value as string);
            }}
            fullWidth={false}
            sx={{ minWidth: 180 }}
          />
        }
        emptyMessage="No areas found matching your search."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedArea ? 'Edit Area' : 'Add Area'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedArea ? 'Update' : 'Create'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<any>} label="Area Name" required />
          <FormSelect
            name="cityId"
            control={control as Control<any>}
            label="City"
            options={cityOptions}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Area"
        message={`Are you sure you want to delete "${selectedArea?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedArea(null); }}
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
