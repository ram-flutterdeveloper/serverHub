'use client';

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowBack, Edit, Refresh } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ImageCell from '@/components/common/ImageCell';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import ImageUploadField from '@/components/common/ImageUploadField';
import FormDialog from '@/components/dialogs/FormDialog';
import { servicesService } from '@/services/services.service';
import { categoriesService, subCategoriesService } from '@/services/categories.service';
import { packagesService } from '@/services/packages.service';
import { citiesService } from '@/services/locations.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Service, type ServicePayload } from '@/types/api';
import { formatCurrency, formatDateTime } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serviceId = params.id;
  const { showToast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingCities, setSavingCities] = useState(false);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [form, setForm] = useState<ServicePayload>({ categoryId: '', name: '' });
  const [image, setImage] = useState<File | null>(null);

  // There is no `GET /services/:id`, so the record is resolved from the list.
  const services = useApiData((signal) => servicesService.list(signal), []);
  const categories = useApiData((signal) => categoriesService.list(signal), []);
  const subCategories = useApiData(
    (signal) => subCategoriesService.listByService(serviceId, signal),
    [serviceId],
  );
  const packages = useApiData(
    (signal) => packagesService.listByService(serviceId, signal),
    [serviceId],
  );
  const cities = useApiData((signal) => citiesService.list(signal), []);
  const assignedCityIds = useApiData(
    (signal) => servicesService.assignedCities(serviceId, signal),
    [serviceId],
  );

  const service: Service | undefined = useMemo(
    () => services.data?.find((item) => item.id === serviceId),
    [services.data, serviceId],
  );

  const categoryName = useMemo(
    () =>
      categories.data?.find((category) => category.id === service?.categoryId)?.name ??
      service?.category?.name ??
      'Unknown category',
    [categories.data, service],
  );

  const cityNameById = useMemo(() => {
    const map = new Map<string, string>();
    (cities.data ?? []).forEach((city) => map.set(city.id, city.name));
    return map;
  }, [cities.data]);

  const categoryOptions = useMemo(
    () => (categories.data ?? []).map((category) => ({ value: category.id, label: category.name })),
    [categories.data],
  );

  const cityOptions = useMemo(
    () =>
      (cities.data ?? [])
        .filter((city) => city.status === RecordStatus.ACTIVE)
        .map((city) => ({ value: city.id, label: `${city.name}, ${city.state}` })),
    [cities.data],
  );

  const handleSubmit = async () => {
    if (!form.categoryId) {
      showToast('Select a category', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Service name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      await servicesService.update(serviceId, { ...form, image });
      showToast('Service updated successfully', 'success');
      setDialogOpen(false);
      services.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = () => {
    if (!service) return;
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

  const openCityDialog = () => {
    setSelectedCityIds(assignedCityIds.data ?? []);
    setCityDialogOpen(true);
  };

  const handleSaveCities = async () => {
    setSavingCities(true);
    try {
      await servicesService.assignCities(serviceId, selectedCityIds);
      showToast('City availability updated', 'success');
      setCityDialogOpen(false);
      assignedCityIds.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update cities', 'error');
    } finally {
      setSavingCities(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={service?.name ?? 'Service details'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Services', path: '/services' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/services')}>
              Back
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={() => {
                services.refetch();
                subCategories.refetch();
                packages.refetch();
                assignedCityIds.refetch();
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={openEditDialog}
              disabled={!service}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      {services.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={services.refetch}>
          {services.error}
        </Alert>
      )}

      {services.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!services.loading && service && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ImageCell src={resolveMediaUrl(service.image)} alt={service.name} size={120} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {service.name}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
                  <StatusChip status={service.status} />
                  {service.isFeatured && <StatusChip status="ACTIVE" label="Featured" />}
                </Stack>
                <Divider sx={{ my: 3 }} />
                <DetailRow label="Slug" value={service.slug} />
                <DetailRow
                  label="Category"
                  value={
                    <Button
                      size="small"
                      onClick={() => router.push(`/categories/${service.categoryId}`)}
                    >
                      {categoryName}
                    </Button>
                  }
                />
                <DetailRow label="Sort order" value={service.sortOrder} />
                <DetailRow label="Created" value={formatDateTime(service.createdAt)} />
                <DetailRow label="Updated" value={formatDateTime(service.updatedAt)} />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader
                title={`Available cities (${assignedCityIds.data?.length ?? 0})`}
                action={
                  <Button size="small" onClick={openCityDialog}>
                    Manage
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {assignedCityIds.error && <Alert severity="error">{assignedCityIds.error}</Alert>}
                {assignedCityIds.loading ? (
                  <Skeleton variant="text" />
                ) : assignedCityIds.data && assignedCityIds.data.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {assignedCityIds.data.map((cityId) => (
                      <Chip
                        key={cityId}
                        size="small"
                        label={cityNameById.get(cityId) ?? cityId}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    This service is not available in any city yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardHeader title="Description" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {service.description ?? 'No description provided.'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader
                title={`Sub services (${subCategories.data?.length ?? 0})`}
                action={
                  <Button size="small" onClick={() => router.push('/sub-services')}>
                    Manage
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {subCategories.error && <Alert severity="error">{subCategories.error}</Alert>}
                {subCategories.loading ? (
                  <Skeleton variant="text" />
                ) : subCategories.data && subCategories.data.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {subCategories.data.map((item) => (
                      <Chip
                        key={item.id}
                        size="small"
                        label={item.name}
                        color={item.status === RecordStatus.ACTIVE ? 'primary' : 'default'}
                        onClick={() => router.push(`/sub-services/${item.id}`)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No sub services yet.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title={`Packages (${packages.data?.length ?? 0})`} />
              <Divider />
              <CardContent>
                {packages.error && <Alert severity="error">{packages.error}</Alert>}
                {packages.loading ? (
                  <Skeleton variant="text" />
                ) : packages.data && packages.data.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Package</TableCell>
                        <TableCell>Default price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {packages.data.map((item) => (
                        <TableRow
                          key={item.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => router.push(`/packages/${item.id}`)}
                        >
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{formatCurrency(Number(item.defaultPrice))}</TableCell>
                          <TableCell>
                            <StatusChip status={item.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No packages for this service yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={dialogOpen}
        title="Edit service"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save changes"
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Category"
            value={form.categoryId}
            onChange={(value) => setForm((prev) => ({ ...prev, categoryId: String(value) }))}
            options={categoryOptions}
            required
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
            previewUrl={service ? resolveMediaUrl(service.image) : null}
          />
        </Stack>
      </FormDialog>

      <FormDialog
        open={cityDialogOpen}
        title="City availability"
        onClose={() => setCityDialogOpen(false)}
        onSubmit={handleSaveCities}
        submitText="Save cities"
        loading={savingCities}
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected cities are the ones where this service can be booked. The backend replaces the
            whole mapping with the cities submitted here.
          </Typography>
          <FormSelect
            label="Cities"
            value={selectedCityIds}
            onChange={(value) =>
              setSelectedCityIds(Array.isArray(value) ? value : [String(value)])
            }
            options={cityOptions}
            multiple
            required
          />
        </Stack>
      </FormDialog>
    </AdminLayout>
  );
}