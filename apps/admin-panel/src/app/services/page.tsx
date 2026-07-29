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
  Chip,
  Rating,
} from '@mui/material';
import {
  Inventory,
  Visibility,
  Star,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyServices } from '@/data/services';
import { dummyCategories } from '@/data/categories';
import { Service, ServiceStatus } from '@/types';
import { formatCurrency } from '@/utils';

const serviceStatusOptions = [
  { value: ServiceStatus.ACTIVE, label: 'Active' },
  { value: ServiceStatus.INACTIVE, label: 'Inactive' },
  { value: ServiceStatus.DRAFT, label: 'Draft' },
  { value: ServiceStatus.ARCHIVED, label: 'Archived' },
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(dummyServices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filtered = useMemo(() => {
    let result = services;
    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, search, statusFilter]);

  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter((s) => s.status === ServiceStatus.ACTIVE).length,
    featured: services.filter((s) => s.isFeatured).length,
    totalBookings: services.reduce((sum, s) => sum + s.totalBookings, 0),
  }), [services]);

  const categoryOptions = dummyCategories.map((c) => ({ value: c.id, label: c.name }));

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Service',
      flex: 2,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.category}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'provider',
      headerName: 'Provider',
      flex: 1.5,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.provider}</Typography>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      width: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.city}</Typography>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(row.price)}
          <Typography variant="caption" color="text.secondary">
            {' '}/ {row.priceType}
          </Typography>
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 160,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating value={row.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({row.rating})
          </Typography>
        </Box>
      ),
    },
    {
      field: 'totalBookings',
      headerName: 'Bookings',
      width: 100,
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.totalBookings}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={() => router.push(`/services/${row.id}`)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Services"
        subtitle="Manage all marketplace services"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => setStatusFilter('all')}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              clickable
            />
            <Chip
              label="Active"
              onClick={() => setStatusFilter(ServiceStatus.ACTIVE)}
              color={statusFilter === ServiceStatus.ACTIVE ? 'success' : 'default'}
              variant={statusFilter === ServiceStatus.ACTIVE ? 'filled' : 'outlined'}
              clickable
            />
            <Chip
              label="Draft"
              onClick={() => setStatusFilter(ServiceStatus.DRAFT)}
              color={statusFilter === ServiceStatus.DRAFT ? 'warning' : 'default'}
              variant={statusFilter === ServiceStatus.DRAFT ? 'filled' : 'outlined'}
              clickable
            />
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Services" value={stats.total} icon={<Inventory />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active" value={stats.active} icon={<Star />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Featured" value={stats.featured} icon={<Star />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={<TrendingUp />} color="info" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search services by title, category, provider, or city..."
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={(row) => router.push(`/services/${row.id}`)}
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
