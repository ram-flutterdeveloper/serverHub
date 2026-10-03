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
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import { subCategoriesService } from '@/services/categories.service';
import { servicesService } from '@/services/services.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type SubCategory, type SubCategoryPayload } from '@/types/api';
import { formatDate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

export default function SubServicesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);
  const [form, setForm] = useState<Omit<SubCategoryPayload, 'image'>>({
    serviceId: '',
    name: '',
    description: '',
    sortOrder: 0,
    isFeatured: false,
    status: RecordStatus.ACTIVE,
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubCategory | null>(null);

  const subCategories = useApiData((signal) => subCategoriesService.list(signal), []);
  const services = useApiData((signal) => servicesService.list(signal), []);

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>();
    (services.data ?? []).forEach((service) => map.set(service.id, service.name));
    return map;
  }, [services.data]);

  const serviceOptions = useMemo(
    () => [
      { value: 'ALL', label: 'All services' },
      ...(services.data ?? [])
        .filter((service) => service.status === RecordStatus.ACTIVE || service.id === form.serviceId)
        .map((service) => ({ value: service.id, label: service.name })),
    ],
    [services.data, form.serviceId],
  );

  const rows = useMemo(() => {
    let list = subCategories.data ?? [];
    if (serviceFilter !== 'ALL') {
      list = list.filter((item) => item.serviceId === serviceFilter);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) =>
      `${item.name} ${item.slug} ${serviceNameById.get(item.serviceId) ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [subCategories.data, search, serviceFilter, serviceNameById]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      serviceId: serviceFilter !== 'ALL' ? serviceFilter : services.data?.[0]?.id ?? '',
      name: '',
      description: '',
      sortOrder: 0,
      isFeatured: false,
      status: RecordStatus.ACTIVE,
    });
    setDialogOpen(true);
  };

  const openEdit = (subCategory: SubCategory) => {
    setEditing(subCategory);
    setForm({
      serviceId: subCategory.serviceId,
      name: subCategory.name,
      description: subCategory.description ?? '',
      sortOrder: subCategory.sortOrder ?? 0,
      isFeatured: subCategory.isFeatured,
      status: subCategory.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.serviceId) {
      showToast('Select the parent service (required by the backend)', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Sub service name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: SubCategoryPayload = { ...form };
      if (editing) {
        await subCategoriesService.update(editing.id, payload);
        showToast('Sub service updated successfully', 'success');
      } else {
        await subCategoriesService.create(payload);
        showToast('Sub service created successfully', 'success');
      }
      setDialogOpen(false);
      subCategories.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save sub service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await subCategoriesService.remove(deleteTarget.id);
      showToast('Sub service deleted successfully', 'success');
      setDeleteTarget(null);
      subCategories.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete sub service', 'error');
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
          <ImageCell src={resolveMediaUrl((params.row as SubCategory).image)} alt={params.row.name} />
        ),
      },
      {
        field: 'name',
        headerName: 'Sub service',
        flex: 1,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const item = params.row as SubCategory;
          return (
            <Box>
              <Typography variant="body2" fontWeight={600} noWrap>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {item.slug}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'serviceId',
        headerName: 'Parent service',
        flex: 1,
        minWidth: 180,
        sortable: false,
        valueGetter: (value: string) => serviceNameById.get(value) ?? 'Unknown service',
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
          const item = params.row as SubCategory;
          return (
            <Stack direction="row" spacing={0.5}>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={(event) => {
                  event.stopPropagation();
                  openEdit(item);
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
                  setDeleteTarget(item);
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
     
    [serviceNameById],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Sub services"
        subtitle="Service level options used when a package is created"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Sub services' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={() => { subCategories.refetch(); services.refetch(); }}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add sub service
            </Button>
          </Stack>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ minWidth: 240 }}>
          <FormSelect
            label="Filter by service"
            value={serviceFilter}
            onChange={(value) => setServiceFilter(String(value))}
            options={serviceOptions}
          />
        </Box>
      </Stack>

      {services.error && <Alert severity="error" sx={{ mb: 2 }}>{services.error}</Alert>}

      <DataTable
        rows={rows}
        columns={columns}
        loading={subCategories.loading}
        error={subCategories.error}
        onRetry={subCategories.refetch}
        clientPagination
        pageSize={25}
        onSearch={setSearch}
        searchPlaceholder="Search sub services"
        onRowClick={(row: SubCategory) => router.push(`/sub-services/${row.id}`)}
        emptyMessage="No sub services yet"
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        The sub service endpoints accept JSON only, so images cannot be uploaded from here. Manage them
        on the service the sub service belongs to.
      </Alert>

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit sub service' : 'Add sub service'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create sub service'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Parent service"
            value={form.serviceId}
            onChange={(value) => setForm((prev) => ({ ...prev, serviceId: String(value) }))}
            options={serviceOptions.filter((option) => option.value !== 'ALL')}
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
            label="Featured sub service"
            checked={Boolean(form.isFeatured)}
            onChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked }))}
          />
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete sub service"
        message={`Delete ${deleteTarget?.name ?? ''}? Packages referencing it must be reassigned first.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}