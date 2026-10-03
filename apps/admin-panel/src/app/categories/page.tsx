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
import FormSelect from '@/components/common/FormSelect';
import FormInput from '@/components/common/FormInput';
import FormSwitchField from '@/components/common/FormSwitchField';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import { categoriesService } from '@/services/categories.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Category, type CategoryPayload } from '@/types/api';
import { formatDate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

const emptyForm: Omit<CategoryPayload, 'image'> = {
  name: '',
  description: '',
  sortOrder: 0,
  isFeatured: false,
  status: RecordStatus.ACTIVE,
};

export default function CategoriesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const categories = useApiData((signal) => categoriesService.list(signal), []);

  const rows = useMemo(() => {
    const list = categories.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((category) =>
      `${category.name} ${category.slug} ${category.description ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [categories.data, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description ?? '',
      sortOrder: category.sortOrder ?? 0,
      isFeatured: category.isFeatured,
      status: category.status,
    });
    setImage(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: CategoryPayload = { ...form, image };
      if (editing) {
        await categoriesService.update(editing.id, payload);
        showToast('Category updated successfully', 'success');
      } else {
        await categoriesService.create(payload);
        showToast('Category created successfully', 'success');
      }
      setDialogOpen(false);
      categories.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await categoriesService.remove(deleteTarget.id);
      showToast('Category deleted successfully', 'success');
      setDeleteTarget(null);
      categories.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete category', 'error');
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
          <ImageCell src={resolveMediaUrl((params.row as Category).image)} alt={params.row.name} />
        ),
      },
      {
        field: 'name',
        headerName: 'Category',
        flex: 1.2,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const category = params.row as Category;
          return (
            <Box>
              <Typography variant="body2" fontWeight={600} noWrap>
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {category.slug}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.4,
        minWidth: 220,
        sortable: false,
        valueGetter: (value: string | null) => value ?? '—',
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
          const category = params.row as Category;
          return (
            <Stack direction="row" spacing={0.5}>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={(event) => {
                  event.stopPropagation();
                  openEdit(category);
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
                  setDeleteTarget(category);
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
     
    [],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Categories"
        subtitle="Top level catalogue categories"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Categories' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={categories.refetch}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add category
            </Button>
          </Stack>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        loading={categories.loading}
        error={categories.error}
        onRetry={categories.refetch}
        clientPagination
        pageSize={25}
        onSearch={setSearch}
        searchPlaceholder="Search categories"
        onRowClick={(row: Category) => router.push(`/categories/${row.id}`)}
        emptyMessage="No categories yet"
      />

      {categories.data && categories.data.length === 0 && !categories.loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          The catalogue is empty. Create the first category to start adding services.
        </Alert>
      )}

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit category' : 'Add category'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create category'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormInput
            label="Name"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            placeholder="Home Cleaning"
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
                onChange={(value) => setForm((prev) => ({ ...prev, status: value as RecordStatus }))}
                options={STATUS_OPTIONS}
              />
            </Box>
          </Stack>

          <FormSwitchField
            label="Featured category"
            checked={Boolean(form.isFeatured)}
            onChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked }))}
          />

          <ImageUploadField
            file={image}
            onChange={setImage}
            previewUrl={editing ? resolveMediaUrl(editing.image) : null}
            label="Category image"
          />
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={`Delete ${deleteTarget?.name ?? ''}? Services linked to this category are not deleted.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
