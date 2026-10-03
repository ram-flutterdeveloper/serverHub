'use client';

import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Add, DeleteOutline, Edit, Refresh } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { GridColDef } from '@mui/x-data-grid';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ImageCell from '@/components/common/ImageCell';
import ImageUploadField from '@/components/common/ImageUploadField';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import { servicesService } from '@/services/services.service';
import { categoriesService } from '@/services/categories.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Service, type ServicePayload } from '@/types/api';
import { formatDate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

export default function ServicesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<ServicePayload, 'image'>>({
    categoryId: '',
    name: '',
    description: '',
    sortOrder: 0,
    isFeatured: false,
    status: RecordStatus.ACTIVE,
  });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const services = useApiData((signal) => servicesService.list(signal), []);
  const categories = useApiData((signal) => categoriesService.list(signal), []);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    (categories.data ?? []).forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories.data]);

  const categoryOptions = useMemo(
    () => [
      { value: 'ALL', label: 'All categories' },
      ...(categories.data ?? []).map((category) => ({ value: category.id, label: category.name })),
    ],
    [categories.data],
  );

  const rows = useMemo(() => {
    let list = services.data ?? [];
    if (categoryFilter !== 'ALL') {
      list = list.filter((item) => item.categoryId === categoryFilter);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) =>
      `${item.name} ${item.slug} ${item.description ?? ''} ${categoryNameById.get(item.categoryId) ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [services.data, search, categoryFilter, categoryNameById]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      categoryId: categoryFilter !== 'ALL' ? categoryFilter : categories.data?.[0]?.id ?? '',
      name: '',
      description: '',
      sortOrder: 0,
      isFeatured: false,
      status: RecordStatus.ACTIVE,
    });
    setImage(null);
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      categoryId: service.categoryId,
      name: service.name,
      description: service.description ?? '',
      sortOrder: service.sortOrder ?? 0,
      isFeatured: service.isFeatured,
      status: service.status,
    });
    setImage(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.categoryId) {
      showToast('Select a category (required by the backend)', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Service name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: ServicePayload = { ...form, image };
      if (editing) {
        await servicesService.update(editing.id, payload);
        showToast('Service updated successfully', 'success');
      } else {
        await servicesService.create(payload);
        showToast('Service created successfully', 'success');
      }
      setDialogOpen(false);
      services.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await servicesService.remove(deleteTarget.id);
      showToast('Service deleted successfully', 'success');
      setDeleteTarget(null);
      services.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'image',
        headerName: '',
        width: 64,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <ImageCell src={resolveMediaUrl((params.row as Service).image)} alt={params.row.name} />
        ),
      },
      {
        field: 'name',
        headerName: 'Service',
        flex: 1.1,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const service = params.row as Service;
          return (
            <Box>
              <Typography variant="body2" fontWeight={600} noWrap>
                {service.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {service.slug}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'categoryId',
        headerName: 'Category',
        flex: 1,
        minWidth: 170,
        sortable: false,
        valueGetter: (value: string) => categoryNameById.get(value) ?? 'Unknown category',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.6,
        minWidth: 110,
        sortable: false,
        renderCell: (params) => <StatusChip status={params.value as string} />,
      },
      {
        field: 'isFeatured',
        headerName: 'Featured',
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          <StatusChip
            status={params.value ? 'ACTIVE' : 'INACTIVE'}
            label={params.value ? 'Featured' : 'Standard'}
          />
        ),
      },
      {
        field: 'sortOrder',
        headerName: 'Order',
        flex: 0.4,
        minWidth: 90,
        sortable: false,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        flex: 0.7,
        minWidth: 130,
        sortable: false,
        valueGetter: (value: string) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.5,
        minWidth: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const service = params.row as Service;
          return (
            <Stack direction="row" spacing={0.5}>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={(event) => {
                  event.stopPropagation();
                  openEdit(service);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutline />}
                onClick={(event) => {
                  event.stopPropagation();
                  setDeleteTarget(service);
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
     
    [categoryNameById],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Services"
        subtitle="Bookable services inside each category"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Services' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={() => { services.refetch(); categories.refetch(); }}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add service
            </Button>
          </Stack>
        }
      />

      <Box sx={{ minWidth: 260, mb: 2 }}>
        <FormSelect
          label="Filter by category"
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(String(value))}
          options={categoryOptions}
        />
      </Box>

      {categories.error && <Alert severity="error" sx={{ mb: 2 }}>{categories.error}</Alert>}

      <DataTable
        rows={rows}
        columns={columns}
        loading={services.loading}
        error={services.error}
        onRetry={services.refetch}
        clientPagination
        pageSize={25}
        onSearch={setSearch}
        searchPlaceholder="Search services"
        onRowClick={(row: Service) => router.push(`/services/${row.id}`)}
        emptyMessage="No services yet"
      />

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit service' : 'Add service'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create service'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Category"
            value={form.categoryId}
            onChange={(value) => setForm((prev) => ({ ...prev, categoryId: String(value) }))}
            options={categoryOptions.filter((option) => option.value !== 'ALL')}
            required
            helperText="Required by the backend on create and update"
          />

          <FormInput
            label="Name"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            required
          />

          <FormInput
            label="Description"
            value={form.description ?? ''}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            multiline
            rows={3}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="Sort order"
              value={form.sortOrder ?? 0}
              onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: Number(value) }))}
              type="number"
            />
            <Box sx={{ flex: 1 }}>
              <FormSelect
                label="Status"
                value={form.status}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, status: String(value) as RecordStatus }))
                }
                options={STATUS_OPTIONS}
              />
            </Box>
          </Stack>

          <FormSwitchField
            label="Featured service"
            checked={Boolean(form.isFeatured)}
            onChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked }))}
          />

          <ImageUploadField
            file={image}
            onChange={setImage}
            previewUrl={editing ? resolveMediaUrl(editing.image) : null}
            label="Service image"
          />
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete service"
        message={`Delete ${deleteTarget?.name ?? ''}? Its sub services, packages and city availability may block the delete.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}