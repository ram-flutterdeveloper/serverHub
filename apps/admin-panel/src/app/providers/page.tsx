'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Rating,
  Stack,
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Delete,
  Visibility,
  Engineering,
  CheckCircle,
  HourglassTop,
  Block,
  Verified,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyProviders } from '@/data/providers';
import { Provider, ProviderStatus } from '@/types';
import { providerSchema, ProviderFormData } from '@/utils/validations';
import { formatCurrency } from '@/utils';

const statusOptions = Object.values(ProviderStatus).map((s) => ({
  value: s,
  label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function ProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>(dummyProviders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: { businessName: '', businessType: '', description: '' },
  });

  const filtered = useMemo(() => {
    let result = providers;
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.businessName.toLowerCase().includes(q) ||
          p.user.firstName.toLowerCase().includes(q) ||
          p.user.lastName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.businessType.toLowerCase().includes(q)
      );
    }
    return result;
  }, [providers, search, statusFilter]);

  const stats = useMemo(() => ({
    total: providers.length,
    approved: providers.filter((p) => p.status === ProviderStatus.APPROVED).length,
    pending: providers.filter((p) => p.status === ProviderStatus.PENDING).length,
    suspended: providers.filter((p) => p.status === ProviderStatus.SUSPENDED).length,
  }), [providers]);

  const handleOpenCreate = () => {
    setSelectedProvider(null);
    reset({ businessName: '', businessType: '', description: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    reset({
      businessName: provider.businessName,
      businessType: provider.businessType,
      description: provider.description,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (provider: Provider) => {
    setSelectedProvider(provider);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: ProviderFormData) => {
    if (selectedProvider) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === selectedProvider.id ? { ...p, ...data } : p
        )
      );
    }
    setDialogOpen(false);
    setSnackbar({ open: true, message: 'Provider saved successfully', severity: 'success' });
  };

  const handleDeleteConfirm = () => {
    if (selectedProvider) {
      setProviders((prev) => prev.filter((p) => p.id !== selectedProvider.id));
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Provider deleted successfully', severity: 'success' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'businessName',
      headerName: 'Business Name',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UserAvatar firstName={row.user.firstName} lastName={row.user.lastName} avatar={row.logo} size={36} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.businessName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.businessType}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {row.user.firstName} {row.user.lastName}
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 0.8,
      minWidth: 140,
      renderCell: ({ row }) => (
        row.rating > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={row.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" fontWeight={600}>
              {row.rating}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">—</Typography>
        )
      ),
    },
    {
      field: 'totalBookings',
      headerName: 'Bookings',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
    },
    {
      field: 'totalEarnings',
      headerName: 'Earnings',
      flex: 0.9,
      minWidth: 110,
      renderCell: ({ row }) => formatCurrency(row.totalEarnings),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    {
      field: 'kycStatus',
      headerName: 'KYC',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => <StatusChip status={row.kycStatus} />,
    },
    {
      field: 'isVerified',
      headerName: 'Verified',
      flex: 0.5,
      minWidth: 70,
      renderCell: ({ row }) =>
        row.isVerified ? (
          <CheckCircle fontSize="small" color="success" />
        ) : (
          <Typography variant="body2" color="text.secondary">—</Typography>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => router.push(`/providers/${row.id}`)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
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
        title="Providers"
        subtitle="Manage service providers"
        action={
          <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenCreate}>
            Add Provider
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Providers" value={stats.total} icon={<Engineering />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Approved" value={stats.approved} icon={<CheckCircle />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending" value={stats.pending} icon={<HourglassTop />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Suspended" value={stats.suspended} icon={<Block />} color="error" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        checkboxSelection
        onSearch={setSearch}
        searchPlaceholder="Search providers by name, owner, city..."
        toolbar={
          // <FormSelect
          //   name="statusFilter"
          //   control={{ _formValues: {}, _defaultValues: {}, _fieldValues: {} } as any}
          //   label="Status"
          //   options={statusOptions}
          //   fullWidth={false}
          // />
          <FormSelect
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as string)}
            fullWidth={false}
            sx={{ minWidth: 160 }}
          />
        }
        onRowClick={(row) => router.push(`/providers/${row.id}`)}
        emptyMessage="No providers found matching your search."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedProvider ? 'Edit Provider' : 'Add Provider'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedProvider ? 'Update' : 'Create'}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="businessName" control={control as Control<any>} label="Business Name" required />
          <FormTextField name="businessType" control={control as Control<any>} label="Business Type" required />
          <FormTextField
            name="description"
            control={control as Control<any>}
            label="Description"
            multiline
            rows={3}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Provider"
        message={`Are you sure you want to delete ${selectedProvider?.businessName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
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
