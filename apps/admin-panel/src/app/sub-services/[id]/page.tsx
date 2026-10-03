'use client';

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import FormDialog from '@/components/dialogs/FormDialog';
import { subCategoriesService } from '@/services/categories.service';
import { servicesService } from '@/services/services.service';
import { packagesService } from '@/services/packages.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type SubCategory, type SubCategoryPayload } from '@/types/api';
import { formatCurrency, formatDateTime } from '@/utils';

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

export default function SubServiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const subCategoryId = params.id;
  const { showToast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // There is no `GET /sub-categories/:id`, so the record is resolved from the list.
  const subCategories = useApiData((signal) => subCategoriesService.list(signal), []);
  const services = useApiData((signal) => servicesService.list(signal), []);
  const packages = useApiData(
    (signal) => packagesService.listBySubCategory(subCategoryId, signal),
    [subCategoryId],
  );

  const subCategory: SubCategory | undefined = useMemo(
    () => subCategories.data?.find((item) => item.id === subCategoryId),
    [subCategories.data, subCategoryId],
  );

  const parentService = useMemo(
    () => services.data?.find((service) => service.id === subCategory?.serviceId),
    [services.data, subCategory?.serviceId],
  );

  const serviceOptions = useMemo(
    () => (services.data ?? []).map((service) => ({ value: service.id, label: service.name })),
    [services.data],
  );

  const [form, setForm] = useState<SubCategoryPayload>({ serviceId: '', name: '' });

  const openEdit = () => {
    if (!subCategory) return;
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
      showToast('Select the parent service', 'error');
      return;
    }
    if (!form.name.trim()) {
      showToast('Sub service name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      await subCategoriesService.update(subCategoryId, form);
      showToast('Sub service updated successfully', 'success');
      setDialogOpen(false);
      subCategories.refetch();
      packages.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save sub service', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={subCategory?.name ?? 'Sub service details'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Sub services', path: '/sub-services' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/sub-services')}>
              Back
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={() => {
                subCategories.refetch();
                services.refetch();
                packages.refetch();
              }}
            >
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Edit />} onClick={openEdit} disabled={!subCategory}>
              Edit
            </Button>
          </Stack>
        }
      />

      {subCategories.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={subCategories.refetch}>
          {subCategories.error}
        </Alert>
      )}

      {subCategories.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!subCategories.loading && subCategory && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardHeader title="Overview" />
              <Divider />
              <CardContent>
                <DetailRow label="Name" value={subCategory.name} />
                <DetailRow label="Slug" value={subCategory.slug} />
                <DetailRow
                  label="Parent service"
                  value={
                    parentService ? (
                      <Button
                        size="small"
                        onClick={() => router.push(`/services/${parentService.id}`)}
                      >
                        {parentService.name}
                      </Button>
                    ) : (
                      'Unknown'
                    )
                  }
                />
                <DetailRow label="Sort order" value={subCategory.sortOrder} />
                <DetailRow
                  label="Status"
                  value={<StatusChip status={subCategory.status} />}
                />
                <DetailRow
                  label="Featured"
                  value={subCategory.isFeatured ? 'Yes' : 'No'}
                />
                <DetailRow label="Created" value={formatDateTime(subCategory.createdAt)} />
                <DetailRow label="Updated" value={formatDateTime(subCategory.updatedAt)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardHeader title="Description" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {subCategory.description ?? 'No description provided.'}
                </Typography>
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
                          <TableCell>
                            {formatCurrency(Number(item.defaultPrice))}
                            {item.offerPrice != null && (
                              <Typography variant="caption" color="success.main" display="block">
                                Offer {formatCurrency(Number(item.offerPrice))}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusChip status={item.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No packages use this sub service yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={dialogOpen}
        title="Edit sub service"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save changes"
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Parent service"
            value={form.serviceId}
            onChange={(value) => setForm((prev) => ({ ...prev, serviceId: String(value) }))}
            options={serviceOptions}
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
            label="Featured sub service"
            checked={Boolean(form.isFeatured)}
            onChange={(checked) => setForm((prev) => ({ ...prev, isFeatured: checked }))}
          />
        </Stack>
      </FormDialog>
    </AdminLayout>
  );
}