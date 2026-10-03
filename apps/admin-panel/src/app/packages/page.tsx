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
import { packagesService } from '@/services/packages.service';
import { servicesService } from '@/services/services.service';
import { subCategoriesService } from '@/services/categories.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type PackagePayload, type PackageRecord } from '@/types/api';
import { formatCurrency, formatDate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

const emptyForm: Omit<PackagePayload, 'image'> = {
  serviceId: '',
  subCategoryId: '',
  name: '',
  defaultPrice: 0,
  offerPrice: 0,
  durationMinutes: 60,
  description: '',
  sortOrder: 0,
  isFeatured: false,
  status: RecordStatus.ACTIVE,
};

export default function PackagesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PackageRecord | null>(null);

  const packages = useApiData((signal) => packagesService.list(signal), []);
  const services = useApiData((signal) => servicesService.list(signal), []);
  const subCategories = useApiData((signal) => subCategoriesService.list(signal), []);

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>();
    (services.data ?? []).forEach((service) => map.set(service.id, service.name));
    return map;
  }, [services.data]);

  const serviceOptions = useMemo(
    () => (services.data ?? []).map((service) => ({ value: service.id, label: service.name })),
    [services.data],
  );

  /** The backend rejects a sub service that belongs to a different service. */
  const subCategoryOptions = useMemo(() => {
    const options = (subCategories.data ?? [])
      .filter((item) => item.serviceId === form.serviceId)
      .map((item) => ({ value: item.id, label: item.name }));
    return [{ value: '', label: 'None (package applies to the whole service)' }, ...options];
  }, [subCategories.data, form.serviceId]);

  const rows = useMemo(() => {
    let list = packages.data ?? [];
    if (serviceFilter !== 'ALL') {
      list = list.filter((item) => item.serviceId === serviceFilter);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) =>
      `${item.name} ${item.slug} ${serviceNameById.get(item.serviceId) ?? ''} ${item.subCategory?.name ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [packages.data, search, serviceFilter, serviceNameById]);

  const openCreate = () => {
    setEditing(null);
    const serviceId = serviceFilter !== 'ALL' ? serviceFilter : services.data?.[0]?.id ?? '';
    const firstSubCategory = (subCategories.data ?? []).find((item) => item.serviceId === serviceId);
    setForm({
      ...emptyForm,
      serviceId,
      subCategoryId: firstSubCategory?.id ?? '',
    });
    setImage(null);
    setDialogOpen(true);
  };

  const openEdit = (item: PackageRecord) => {
    setEditing(item);
    setForm({
      serviceId: item.serviceId,
      subCategoryId: item.subCategoryId ?? '',
      name: item.name,
      defaultPrice: Number(item.defaultPrice),
      offerPrice: item.offerPrice != null ? Number(item.offerPrice) : 0,
      durationMinutes: item.durationMinutes,
      description: item.description ?? '',
      sortOrder: item.sortOrder ?? 0,
      isFeatured: item.isFeatured,
      status: item.status,
    });
    setImage(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.serviceId) {
      showToast('Select a service (required by the backend)', 'error');
      return;
    }
    if (!form.subCategoryId) {
      showToast('Select a sub service (required by the validator)', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Package name is required', 'error');
      return;
    }
    if (!form.defaultPrice || form.defaultPrice <= 0) {
      showToast('Default price must be greater than 0', 'error');
      return;
    }
    if (!form.durationMinutes || form.durationMinutes < 1) {
      showToast('Duration must be at least 1 minute', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: PackagePayload = {
        ...form,
        offerPrice: form.offerPrice && form.offerPrice > 0 ? form.offerPrice : null,
        image,
      };
      if (editing) {
        await packagesService.update(editing.id, payload);
        showToast('Package updated successfully', 'success');
      } else {
        await packagesService.create(payload);
        showToast('Package created successfully', 'success');
      }
      setDialogOpen(false);
      packages.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save package', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await packagesService.remove(deleteTarget.id);
      showToast('Package deleted successfully', 'success');
      setDeleteTarget(null);
      packages.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete package', 'error');
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
          <ImageCell
            src={resolveMediaUrl((params.row as PackageRecord).image)}
            alt={params.row.name}
          />
        ),
      },
      {
        field: 'name',
        headerName: 'Package',
        flex: 1.1,
        minWidth: 190,
        sortable: false,
        renderCell: (params) => {
          const item = params.row as PackageRecord;
          return (
            <Box>
              <Typography variant="body2" fontWeight={600} noWrap>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {serviceNameById.get(item.serviceId) ?? 'Unknown service'}
                {item.subCategory?.name ? ` • ${item.subCategory.name}` : ''}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'defaultPrice',
        headerName: 'Price',
        flex: 0.7,
        minWidth: 140,
        sortable: false,
        valueGetter: (value: number | string, row: PackageRecord) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(Number(value))}
            </Typography>
            {row.offerPrice != null && (
              <Typography variant="caption" color="success.main">
                Offer {formatCurrency(Number(row.offerPrice))}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'durationMinutes',
        headerName: 'Duration',
        flex: 0.5,
        minWidth: 110,
        sortable: false,
        valueGetter: (value: number) => `${value} min`,
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
          const item = params.row as PackageRecord;
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
        title="Packages"
        subtitle="Priced offerings that customers book"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Packages' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={() => { packages.refetch(); services.refetch(); }}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add package
            </Button>
          </Stack>
        }
      />

      <Box sx={{ minWidth: 260, mb: 2 }}>
        <FormSelect
          label="Filter by service"
          value={serviceFilter}
          onChange={(value) => setServiceFilter(String(value))}
          options={[{ value: 'ALL', label: 'All services' }, ...serviceOptions]}
        />
      </Box>

      {services.error && <Alert severity="error" sx={{ mb: 2 }}>{services.error}</Alert>}
      {subCategories.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {subCategories.error}
        </Alert>
      )}

      <DataTable
        rows={rows}
        columns={columns}
        loading={packages.loading}
        error={packages.error}
        onRetry={packages.refetch}
        clientPagination
        pageSize={25}
        onSearch={setSearch}
        searchPlaceholder="Search packages"
        onRowClick={(row: PackageRecord) => router.push(`/packages/${row.id}`)}
        emptyMessage="No packages yet"
      />

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit package' : 'Add package'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create package'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Service"
            value={form.serviceId}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                serviceId: String(value),
                subCategoryId: '',
              }))
            }
            options={serviceOptions}
            required
            helperText="Required by the backend service layer"
          />

          <FormSelect
            label="Sub service"
            value={form.subCategoryId}
            onChange={(value) => setForm((prev) => ({ ...prev, subCategoryId: String(value) }))}
            options={subCategoryOptions}
            required
            helperText="Must belong to the selected service; the create validator requires a value"
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
              label="Default price"
              value={form.defaultPrice}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, defaultPrice: Number(value) }))
              }
              type="number"
              required
            />
            <FormInput
              label="Offer price"
              value={form.offerPrice ?? 0}
              onChange={(value) => setForm((prev) => ({ ...prev, offerPrice: Number(value) }))}
              type="number"
              helperText="0 keeps it empty"
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="Duration (minutes)"
              value={form.durationMinutes}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, durationMinutes: Number(value) }))
              }
              type="number"
              required
            />
            <FormInput
              label="Sort order"
              value={form.sortOrder ?? 0}
              onChange={(value) => setForm((prev) => ({ ...prev, sortOrder: Number(value) }))}
              type="number"
            />
          </Stack>

          <FormSelect
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, status: String(value) as RecordStatus }))
            }
            options={STATUS_OPTIONS}
          />

          <FormSwitchField
            label="Featured package"
            checked={Boolean(form.isFeatured)}
            onChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked }))}
          />

          <ImageUploadField
            file={image}
            onChange={setImage}
            previewUrl={editing ? resolveMediaUrl(editing.image) : null}
            label="Package image"
          />
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete package"
        message={`Delete ${deleteTarget?.name ?? ''}? Its package details are removed as well.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}