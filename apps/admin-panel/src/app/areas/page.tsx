'use client';

import React, { useMemo, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Add, DeleteOutline, Edit, Refresh } from '@mui/icons-material';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import {
  areasService,
  citiesService,
  type AreaPayload,
} from '@/services/locations.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Area } from '@/types/api';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

const emptyForm: AreaPayload = {
  cityId: '',
  name: '',
  googlePlaceId: '',
  latitude: 0,
  longitude: 0,
  pincode: '',
  sortOrder: 0,
  status: RecordStatus.ACTIVE,
};

export default function AreasPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState<AreaPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);

  const areas = useApiData((signal) => areasService.list(signal), []);
  const cities = useApiData((signal) => citiesService.list(signal), []);

  const cityNameById = useMemo(() => {
    const map = new Map<string, string>();
    (cities.data ?? []).forEach((city) => map.set(city.id, city.name));
    return map;
  }, [cities.data]);

  const cityOptions = useMemo(
    () => (cities.data ?? []).map((city) => ({ value: city.id, label: `${city.name}, ${city.state}` })),
    [cities.data],
  );

  const rows = useMemo(() => {
    let list = areas.data ?? [];
    if (cityFilter !== 'ALL') {
      list = list.filter((area) => area.cityId === cityFilter);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((area) =>
      `${area.name} ${area.slug} ${area.pincode ?? ''} ${cityNameById.get(area.cityId) ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [areas.data, search, cityFilter, cityNameById]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      cityId: cityFilter !== 'ALL' ? cityFilter : cities.data?.[0]?.id ?? '',
    });
    setDialogOpen(true);
  };

  const openEdit = (area: Area) => {
    setEditing(area);
    setForm({
      cityId: area.cityId,
      name: area.name,
      googlePlaceId: area.googlePlaceId ?? '',
      latitude: area.latitude ?? 0,
      longitude: area.longitude ?? 0,
      pincode: area.pincode ?? '',
      sortOrder: area.sortOrder ?? 0,
      status: area.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.cityId) {
      showToast('Select a city (required by the backend)', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Area name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: AreaPayload = {
        ...form,
        googlePlaceId: form.googlePlaceId || null,
        pincode: form.pincode || null,
        latitude: form.latitude === 0 ? null : Number(form.latitude),
        longitude: form.longitude === 0 ? null : Number(form.longitude),
      };
      if (editing) {
        await areasService.update(editing.id, payload);
        showToast('Area updated successfully', 'success');
      } else {
        await areasService.create(payload);
        showToast('Area created successfully', 'success');
      }
      setDialogOpen(false);
      areas.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save area', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await areasService.remove(deleteTarget.id);
      showToast('Area deleted successfully', 'success');
      setDeleteTarget(null);
      areas.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete area', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Areas"
        subtitle="Localities grouped under each city"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Areas' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={areas.refetch}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add area
            </Button>
          </Stack>
        }
      />

      <Box sx={{ minWidth: 260, mb: 2 }}>
        <FormSelect
          label="Filter by city"
          value={cityFilter}
          onChange={(value) => setCityFilter(String(value))}
          options={[{ value: 'ALL', label: 'All cities' }, ...cityOptions]}
        />
      </Box>

      <DataTable
        rows={rows}
        clientPagination
        pageSize={25}
        loading={areas.loading}
        error={areas.error}
        onRetry={areas.refetch}
        onSearch={setSearch}
        searchPlaceholder="Search areas"
        emptyMessage="No areas configured"
        columns={[
          {
            field: 'name',
            headerName: 'Area',
            flex: 1,
            minWidth: 190,
            sortable: false,
            renderCell: (params) => {
              const area = params.row as Area;
              return (
                <Box>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {area.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {area.slug}
                  </Typography>
                </Box>
              );
            },
          },
          {
            field: 'cityId',
            headerName: 'City',
            flex: 1,
            minWidth: 170,
            sortable: false,
            valueGetter: (value: string) => cityNameById.get(value) ?? 'Unknown city',
          },
          {
            field: 'pincode',
            headerName: 'Pincode',
            flex: 0.6,
            minWidth: 120,
            sortable: false,
            valueGetter: (value: string | null) => value ?? '—',
          },
          {
            field: 'latitude',
            headerName: 'Coordinates',
            flex: 0.9,
            minWidth: 170,
            sortable: false,
            valueGetter: (value: number | null, row: Area) =>
              value == null || row.longitude == null ? '—' : `${value}, ${row.longitude}`,
          },
          {
            field: 'sortOrder',
            headerName: 'Order',
            flex: 0.4,
            minWidth: 90,
            sortable: false,
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
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            minWidth: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const area = params.row as Area;
              return (
                <Stack direction="row" spacing={0.5}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openEdit(area);
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
                      setDeleteTarget(area);
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              );
            },
          },
        ]}
      />

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit area' : 'Add area'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create area'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="City"
            value={form.cityId}
            onChange={(value) => setForm((prev) => ({ ...prev, cityId: String(value) }))}
            options={cityOptions}
            required
            helperText="Required by the backend on create and update"
          />
          <FormInput
            label="Area name"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            required
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="Pincode"
              value={form.pincode ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, pincode: value }))}
            />
            <FormInput
              label="Google place id"
              value={form.googlePlaceId ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, googlePlaceId: value }))}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="Latitude"
              value={form.latitude ?? 0}
              onChange={(value) => setForm((prev) => ({ ...prev, latitude: Number(value) }))}
              type="number"
            />
            <FormInput
              label="Longitude"
              value={form.longitude ?? 0}
              onChange={(value) => setForm((prev) => ({ ...prev, longitude: Number(value) }))}
              type="number"
            />
          </Stack>
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
                  setForm((prev) => ({ ...prev, status: String(value) as AreaPayload['status'] }))
                }
                options={STATUS_OPTIONS}
              />
            </Box>
          </Stack>
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete area"
        message={`Delete ${deleteTarget?.name ?? ''}? Provider locations in this area may block the delete.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}