'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import SearchField from '@/components/common/SearchField';
import StatCard from '@/components/common/StatCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormDialog from '@/components/common/FormDialog';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import { dummyPackages } from '@/data/packages';
import { dummySubServices } from '@/data/subServices';
import { formatCurrency } from '@/utils';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import type { Package } from '@/types';

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceId: z.string().min(1, 'Service is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 hour'),
  features: z.string().min(1, 'At least one feature is required'),
});

type PackageFormData = z.infer<typeof packageSchema>;

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(dummyPackages);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Package | null>(null);

  const addForm = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      serviceId: '',
      description: '',
      price: 0,
      duration: 1,
      features: '',
    },
  });

  const editForm = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      serviceId: '',
      description: '',
      price: 0,
      duration: 1,
      features: '',
    },
  });

  const serviceOptions = dummySubServices.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const totalPackages = packages.length;
  const activePackages = packages.filter((p) => p.isActive).length;
  const totalBookings = packages.reduce((sum, p) => sum + p.bookings, 0);

  const filtered = useMemo(() => {
    if (!search) return packages;
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.serviceName.toLowerCase().includes(search.toLowerCase())
    );
  }, [packages, search]);

  const handleAdd = (data: PackageFormData) => {
    const svc = dummySubServices.find((s) => s.id === data.serviceId);
    const newPkg: Package = {
      id: String(packages.length + 1),
      serviceId: data.serviceId,
      serviceName: svc?.name || '',
      name: data.name,
      description: data.description || '',
      price: data.price,
      features: data.features.split(',').map((f) => f.trim()).filter(Boolean),
      duration: data.duration,
      isActive: true,
      bookings: 0,
    };
    setPackages((prev) => [...prev, newPkg]);
    setAddOpen(false);
    addForm.reset();
  };

  const handleEdit = (data: PackageFormData) => {
    if (!selected) return;
    const svc = dummySubServices.find((s) => s.id === data.serviceId);
    setPackages((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              name: data.name,
              serviceId: data.serviceId,
              serviceName: svc?.name || '',
              description: data.description || '',
              price: data.price,
              features: data.features.split(',').map((f) => f.trim()).filter(Boolean),
              duration: data.duration,
            }
          : p
      )
    );
    setEditOpen(false);
    editForm.reset();
    setSelected(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    setPackages((prev) => prev.filter((p) => p.id !== selected.id));
    setDeleteOpen(false);
    setSelected(null);
  };

  const openEdit = (row: Package) => {
    setSelected(row);
    editForm.reset({
      name: row.name,
      serviceId: row.serviceId,
      description: row.description,
      price: row.price,
      duration: row.duration,
      features: row.features.join(', '),
    });
    setEditOpen(true);
  };

  const openDelete = (row: Package) => {
    setSelected(row);
    setDeleteOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
      ),
    },
    { field: 'serviceName', headerName: 'Service', flex: 1, minWidth: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500} color="primary">
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}h
        </Typography>
      ),
    },
    {
      field: 'bookings',
      headerName: 'Bookings',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <StatusChip status={params.value ? 'active' : 'inactive'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Packages"
        description="Manage service packages"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add Package
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <StatCard title="Total Packages" value={totalPackages} icon={<Inventory2Icon />} />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <StatCard title="Active" value={activePackages} icon={<Inventory2Icon />} color="success" />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <StatCard title="Total Bookings" value={totalBookings} icon={<Inventory2Icon />} color="info" />
        </Box>
      </Box>

      <SearchField value={search} onChange={setSearch} placeholder="Search packages..." />

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': { py: 1.5 },
          }}
        />
      </Box>

      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Package"
        onSubmit={addForm.handleSubmit(handleAdd)}
      >
        <FormTextField control={addForm.control} name="name" label="Package Name" required />
        <FormSelect
          control={addForm.control}
          name="serviceId"
          options={serviceOptions}
          label="Service"
          required
        />
        <FormTextField control={addForm.control} name="description" label="Description" multiline rows={2} />
        <FormTextField control={addForm.control} name="price" label="Price ($)" type="number" required />
        <FormTextField control={addForm.control} name="duration" label="Duration (hours)" type="number" required />
        <FormTextField
          control={addForm.control}
          name="features"
          label="Features (comma-separated)"
          placeholder="Feature 1, Feature 2, Feature 3"
          multiline
          rows={2}
        />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
          editForm.reset();
        }}
        title="Edit Package"
        onSubmit={editForm.handleSubmit(handleEdit)}
      >
        <FormTextField control={editForm.control} name="name" label="Package Name" required />
        <FormSelect
          control={editForm.control}
          name="serviceId"
          options={serviceOptions}
          label="Service"
          required
        />
        <FormTextField control={editForm.control} name="description" label="Description" multiline rows={2} />
        <FormTextField control={editForm.control} name="price" label="Price ($)" type="number" required />
        <FormTextField control={editForm.control} name="duration" label="Duration (hours)" type="number" required />
        <FormTextField
          control={editForm.control}
          name="features"
          label="Features (comma-separated)"
          multiline
          rows={2}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
        onConfirm={handleDelete}
        title="Delete Package"
        message={`Are you sure you want to delete "${selected?.name}"?`}
        confirmText="Delete"
        severity="error"
      />
    </AdminLayout>
  );
}
