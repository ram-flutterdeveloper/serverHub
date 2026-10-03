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
import { areasService, citiesService, type CityPayload } from '@/services/locations.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type City } from '@/types/api';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

const emptyForm: CityPayload = {
  name: '',
  state: '',
  country: 'India',
  googlePlaceId: '',
  latitude: 0,
  longitude: 0,
  sortOrder: 0,
  status: RecordStatus.ACTIVE,
};

export default function CitiesPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState<CityPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<City | null>(null);

  const cities = useApiData((signal) => citiesService.list(signal), []);
  const areas = useApiData((signal) => areasService.list(signal), []);

  const areaCountByCity = useMemo(() => {
    const map = new Map<string, number>();
    (areas.data ?? []).forEach((area) => {
      map.set(area.cityId, (map.get(area.cityId) ?? 0) + 1);
    });
    return map;
  }, [areas.data]);

  const rows = useMemo(() => {
    let list = cities.data ?? [];
    if (statusFilter !== 'ALL') {
      list = list.filter((city) => city.status === statusFilter);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((city) =>
      `${city.name} ${city.state} ${city.country} ${city.slug}`.toLowerCase().includes(term),
    );
  }, [cities.data, search, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (city: City) => {
    setEditing(city);
    setForm({
      name: city.name,
      state: city.state,
      country: city.country,
      googlePlaceId: city.googlePlaceId ?? '',
      latitude: city.latitude ?? 0,
      longitude: city.longitude ?? 0,
      sortOrder: city.sortOrder ?? 0,
      status: city.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast('City name is required', 'error');
      return;
    }
    if (!form.state.trim()) {
      showToast('State is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: CityPayload = {
        ...form,
        googlePlaceId: form.googlePlaceId || null,
        latitude: form.latitude === 0 ? null : Number(form.latitude),
        longitude: form.longitude === 0 ? null : Number(form.longitude),
      };
      if (editing) {
        await citiesService.update(editing.id, payload);
        showToast('City updated successfully', 'success');
      } else {
        await citiesService.create(payload);
        showToast('City created successfully', 'success');
      }
      setDialogOpen(false);
      cities.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save city', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await citiesService.remove(deleteTarget.id);
      showToast('City deleted successfully', 'success');
      setDeleteTarget(null);
      cities.refetch();
      areas.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete city', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Cities"
        subtitle="Service locations used for availability and discovery"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Cities' }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Refresh />} onClick={cities.refetch}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add city
            </Button>
          </Stack>
        }
      />

      <Box sx={{ minWidth: 220, mb: 2 }}>
        <FormSelect
          label="Status"
          value={statusFilter}
          onChange={(value) => setStatusFilter(String(value))}
          options={[
            { value: 'ALL', label: 'All statuses' },
            { value: RecordStatus.ACTIVE, label: 'Active' },
            { value: RecordStatus.INACTIVE, label: 'Inactive' },
          ]}
        />
      </Box>

      <DataTable
        rows={rows}
        clientPagination
        pageSize={25}
        loading={cities.loading}
        error={cities.error}
        onRetry={cities.refetch}
        onSearch={setSearch}
        searchPlaceholder="Search cities"
        emptyMessage="No cities configured"
        columns={[
          {
            field: 'name',
            headerName: 'City',
            flex: 1,
            minWidth: 190,
            sortable: false,
            renderCell: (params) => {
              const city = params.row as City;
              return (
                <Box>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {city.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {city.slug}
                  </Typography>
                </Box>
              );
            },
          },
          {
            field: 'state',
            headerName: 'State / Country',
            flex: 1,
            minWidth: 170,
            sortable: false,
            valueGetter: (value: string, row: City) => `${value}, ${row.country}`,
          },
          {
            field: 'latitude',
            headerName: 'Coordinates',
            flex: 0.9,
            minWidth: 180,
            sortable: false,
            valueGetter: (value: number | null, row: City) =>
              value == null || row.longitude == null ? '—' : `${value}, ${row.longitude}`,
          },
          {
            field: 'cityId',
            headerName: 'Areas',
            flex: 0.5,
            minWidth: 90,
            sortable: false,
            valueGetter: (value: string, row: City) => areaCountByCity.get(row.id) ?? 0,
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
              const city = params.row as City;
              return (
                <Stack direction="row" spacing={0.5}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openEdit(city);
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
                      setDeleteTarget(city);
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
        title={editing ? 'Edit city' : 'Add city'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText={editing ? 'Save changes' : 'Create city'}
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormInput
            label="City name"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            required
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="State"
              value={form.state}
              onChange={(value) => setForm((prev) => ({ ...prev, state: value }))}
              required
            />
            <FormInput
              label="Country"
              value={form.country ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, country: value }))}
            />
          </Stack>
          <FormInput
            label="Google place id"
            value={form.googlePlaceId ?? ''}
            onChange={(value) => setForm((prev) => ({ ...prev, googlePlaceId: value }))}
            helperText="Optional, used for place search"
          />
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
                  setForm((prev) => ({ ...prev, status: String(value) as CityPayload['status'] }))
                }
                options={STATUS_OPTIONS}
              />
            </Box>
          </Stack>
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete city"
        message={`Delete ${deleteTarget?.name ?? ''}? Areas and provider locations in this city may block the delete.`}
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}