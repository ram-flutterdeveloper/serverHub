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
import ImageCell from '@/components/common/ImageCell';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import ImageUploadField from '@/components/common/ImageUploadField';
import FormDialog from '@/components/dialogs/FormDialog';
import { categoriesService, subCategoriesService } from '@/services/categories.service';
import { servicesService } from '@/services/services.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Category, type CategoryPayload } from '@/types/api';
import { formatDateTime } from '@/utils';
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

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const { showToast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CategoryPayload>({
    name: '',
    description: '',
    sortOrder: 0,
    isFeatured: false,
    status: RecordStatus.ACTIVE,
  });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = useApiData((signal) => categoriesService.list(signal), []);
  const services = useApiData(
    (signal) => servicesService.listByCategory(categoryId, signal),
    [categoryId],
  );

  const category: Category | undefined = useMemo(
    () => categories.data?.find((item) => item.id === categoryId),
    [categories.data, categoryId],
  );

  /**
   * `GET /sub-categories` returns every sub service with its `serviceId`, so the
   * ones belonging to this category are filtered client side instead of issuing
   * one request per service (`GET /sub-categories/service/:serviceId`).
   */
  const subCategories = useApiData(
    async (signal) => {
      const [all, servicesInCategory] = await Promise.all([
        subCategoriesService.list(signal),
        servicesService.listByCategory(categoryId, signal),
      ]);
      const serviceIds = new Set(servicesInCategory.map((service) => service.id));
      return all.filter((item) => serviceIds.has(item.serviceId));
    },
    [categoryId],
  );

  const openEdit = () => {
    if (!category) return;
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
      await categoriesService.update(categoryId, { ...form, image });
      showToast('Category updated successfully', 'success');
      setDialogOpen(false);
      categories.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={category?.name ?? 'Category details'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Categories', path: '/categories' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/categories')}>
              Back
            </Button>
            <Button startIcon={<Refresh />} onClick={() => { categories.refetch(); services.refetch(); }}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={openEdit}
              disabled={!category}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      {categories.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={categories.refetch}>
          {categories.error}
        </Alert>
      )}

      {categories.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!categories.loading && category && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ImageCell src={resolveMediaUrl(category.image)} alt={category.name} size={120} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {category.name}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
                  <StatusChip status={category.status} />
                  {category.isFeatured && <StatusChip status="ACTIVE" label="Featured" />}
                </Stack>
                <Divider sx={{ my: 3 }} />
                <DetailRow label="Slug" value={category.slug} />
                <DetailRow label="Sort order" value={category.sortOrder} />
                <DetailRow label="Created" value={formatDateTime(category.createdAt)} />
                <DetailRow label="Updated" value={formatDateTime(category.updatedAt)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title="Description" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {category.description ?? 'No description provided.'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title={`Services (${services.data?.length ?? 0})`} />
              <Divider />
              <CardContent>
                {services.error && <Alert severity="error">{services.error}</Alert>}
                {services.loading ? (
                  <Skeleton variant="text" />
                ) : services.data && services.data.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Featured</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.data.map((service) => (
                        <TableRow
                          key={service.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => router.push(`/services/${service.id}`)}
                        >
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <StatusChip status={service.status} />
                          </TableCell>
                          <TableCell>{service.isFeatured ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No services in this category yet.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title={`Sub services (${subCategories.data?.length ?? 0})`} />
              <Divider />
              <CardContent>
                {subCategories.loading ? (
                  <Skeleton variant="text" />
                ) : subCategories.data && subCategories.data.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {subCategories.data.map((subCategory) => (
                      <StatusChip
                        key={subCategory.id}
                        status={subCategory.status}
                        label={subCategory.name}
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
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={dialogOpen}
        title="Edit category"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save changes"
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
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
            previewUrl={category ? resolveMediaUrl(category.image) : null}
          />
        </Stack>
      </FormDialog>
    </AdminLayout>
  );
}