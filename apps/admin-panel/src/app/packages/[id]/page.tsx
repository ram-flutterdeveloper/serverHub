'use client';

import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowBack, Edit, Refresh, Save } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ImageCell from '@/components/common/ImageCell';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormSwitchField from '@/components/common/FormSwitchField';
import ImageUploadField from '@/components/common/ImageUploadField';
import RepeatableListField, {
  type RepeatableRow,
} from '@/components/common/RepeatableListField';
import FormDialog from '@/components/dialogs/FormDialog';
import { packagesService } from '@/services/packages.service';
import { servicesService } from '@/services/services.service';
import { subCategoriesService } from '@/services/categories.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import {
  RecordStatus,
  type PackageDetailsPayload,
  type PackageDetailsResponse,
  type PackagePayload,
  type PackageRecord,
} from '@/types/api';
import { formatCurrency, formatDateTime } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active' },
  { value: RecordStatus.INACTIVE, label: 'Inactive' },
];

interface DetailsFormState {
  description: string;
  whyChooseUs: string;
  images: RepeatableRow[];
  included: RepeatableRow[];
  excluded: RepeatableRow[];
  howItWorks: RepeatableRow[];
  benefits: RepeatableRow[];
  faqs: RepeatableRow[];
}

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

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const packageId = params.id;
  const { showToast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState<PackagePayload>({
    serviceId: '',
    subCategoryId: '',
    name: '',
    defaultPrice: 0,
    durationMinutes: 60,
  });
  const [details, setDetails] = useState<DetailsFormState>({
    description: '',
    whyChooseUs: '',
    images: [],
    included: [],
    excluded: [],
    howItWorks: [],
    benefits: [],
    faqs: [],
  });

  // There is no `GET /packages/:id`, so the record is resolved from the list.
  const packages = useApiData((signal) => packagesService.list(signal), []);
  const services = useApiData((signal) => servicesService.list(signal), []);
  const subCategories = useApiData((signal) => subCategoriesService.list(signal), []);
  const packageDetails = useApiData<PackageDetailsResponse>(
    (signal) => packagesService.getDetails(packageId, signal),
    [packageId],
  );

  const record: PackageRecord | undefined = useMemo(
    () => packages.data?.find((item) => item.id === packageId),
    [packages.data, packageId],
  );

  const serviceOptions = useMemo(
    () => (services.data ?? []).map((service) => ({ value: service.id, label: service.name })),
    [services.data],
  );

  const subCategoryOptions = useMemo(() => {
    const options = (subCategories.data ?? [])
      .filter((item) => item.serviceId === form.serviceId || item.id === record?.subCategoryId)
      .map((item) => ({ value: item.id, label: item.name }));
    return [{ value: '', label: 'None' }, ...options];
  }, [subCategories.data, form.serviceId, record?.subCategoryId]);

  const openEditDialog = () => {
    if (!record) return;
    setForm({
      serviceId: record.serviceId,
      subCategoryId: record.subCategoryId ?? '',
      name: record.name,
      defaultPrice: Number(record.defaultPrice),
      offerPrice: record.offerPrice != null ? Number(record.offerPrice) : null,
      durationMinutes: record.durationMinutes,
      description: record.description ?? '',
      sortOrder: record.sortOrder ?? 0,
      isFeatured: record.isFeatured,
      status: record.status,
    });
    setImage(null);
    setDialogOpen(true);
  };

  const openDetailsDialog = () => {
    const data = packageDetails.data;
    if (!data) return;
    setDetails({
      description: data.description ?? '',
      whyChooseUs: data.whyChooseUs ?? '',
      images: data.images.map((item) => ({ image: item.image, title: item.title ?? '' })),
      included: data.included.map((item) => ({
        title: item.title,
        description: item.description ?? '',
        image: item.image ?? '',
      })),
      excluded: data.excluded.map((item) => ({
        title: item.title,
        description: item.description ?? '',
        image: item.image ?? '',
      })),
      howItWorks: data.howItWorks.map((item) => ({
        step: String(item.step),
        title: item.title,
        description: item.description,
        image: item.image ?? '',
      })),
      benefits: data.benefits.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image ?? '',
      })),
      faqs: data.faqs.map((item) => ({ question: item.question, answer: item.answer })),
    });
    setDetailsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.serviceId) {
      showToast('Select a service', 'error');
      return;
    }
    if (!form.subCategoryId) {
      showToast('Select a sub service', 'error');
      return;
    }
    if (!form.name.trim() || !form.defaultPrice || form.durationMinutes < 1) {
      showToast('Name, default price and duration are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await packagesService.update(packageId, { ...form, image });
      showToast('Package updated successfully', 'success');
      setDialogOpen(false);
      packages.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save package', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toPayload = (state: DetailsFormState): PackageDetailsPayload => ({
    description: state.description || null,
    whyChooseUs: state.whyChooseUs || null,
    images: state.images
      .filter((row) => row.image?.trim())
      .map((row, index) => ({
        image: row.image.trim(),
        title: row.title?.trim() || null,
        sortOrder: index + 1,
      })),
    included: state.included
      .filter((row) => row.title?.trim())
      .map((row, index) => ({
        title: row.title.trim(),
        description: row.description?.trim() || null,
        image: row.image?.trim() || null,
        sortOrder: index + 1,
      })),
    excluded: state.excluded
      .filter((row) => row.title?.trim())
      .map((row, index) => ({
        title: row.title.trim(),
        description: row.description?.trim() || null,
        image: row.image?.trim() || null,
        sortOrder: index + 1,
      })),
    benefits: state.benefits
      .filter((row) => row.title?.trim() && row.description?.trim())
      .map((row, index) => ({
        title: row.title.trim(),
        description: row.description.trim(),
        image: row.image?.trim() || null,
        sortOrder: index + 1,
      })),
    howItWorks: state.howItWorks
      .filter((row) => row.title?.trim() && row.description?.trim())
      .map((row, index) => ({
        step: Number(row.step) || index + 1,
        title: row.title.trim(),
        description: row.description.trim(),
        image: row.image?.trim() || null,
      })),
    faqs: state.faqs
      .filter((row) => row.question?.trim() && row.answer?.trim())
      .map((row, index) => ({
        question: row.question.trim(),
        answer: row.answer.trim(),
        sortOrder: index + 1,
      })),
  });

  const handleSaveDetails = async () => {
    setSavingDetails(true);
    try {
      await packagesService.updateDetails(packageId, toPayload(details));
      showToast('Package details saved', 'success');
      setDetailsDialogOpen(false);
      packageDetails.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save package details', 'error');
    } finally {
      setSavingDetails(false);
    }
  };

  const serviceName =
    services.data?.find((service) => service.id === record?.serviceId)?.name ?? 'Unknown service';

  return (
    <AdminLayout>
      <PageHeader
        title={record?.name ?? 'Package details'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Packages', path: '/packages' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/packages')}>
              Back
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={() => {
                packages.refetch();
                packageDetails.refetch();
              }}
            >
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Edit />} onClick={openEditDialog} disabled={!record}>
              Edit package
            </Button>
          </Stack>
        }
      />

      {packages.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={packages.refetch}>
          {packages.error}
        </Alert>
      )}

      {packages.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!packages.loading && record && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ImageCell src={resolveMediaUrl(record.image)} alt={record.name} size={120} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {record.name}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
                  <StatusChip status={record.status} />
                  {record.isFeatured && <StatusChip status="ACTIVE" label="Featured" />}
                </Stack>
                <Divider sx={{ my: 3 }} />
                <DetailRow label="Slug" value={record.slug} />
                <DetailRow
                  label="Service"
                  value={
                    <Button size="small" onClick={() => router.push(`/services/${record.serviceId}`)}>
                      {serviceName}
                    </Button>
                  }
                />
                <DetailRow
                  label="Sub service"
                  value={
                    record.subCategoryId ? (
                      <Button
                        size="small"
                        onClick={() => router.push(`/sub-services/${record.subCategoryId}`)}
                      >
                        {record.subCategory?.name ?? 'View'}
                      </Button>
                    ) : (
                      'None'
                    )
                  }
                />
                <DetailRow label="Default price" value={formatCurrency(Number(record.defaultPrice))} />
                <DetailRow
                  label="Offer price"
                  value={
                    record.offerPrice != null ? formatCurrency(Number(record.offerPrice)) : '—'
                  }
                />
                <DetailRow label="Duration" value={`${record.durationMinutes} min`} />
                <DetailRow label="Sort order" value={record.sortOrder} />
                <DetailRow label="Created" value={formatDateTime(record.createdAt)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title="Description" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {record.description ?? 'No description provided.'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader
                title="Package details"
                subheader="Customer facing content: images, inclusions, steps and FAQs"
                action={
                  <Button
                    size="small"
                    startIcon={<Save />}
                    onClick={openDetailsDialog}
                    disabled={packageDetails.loading}
                  >
                    Edit details
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {packageDetails.error && (
                  <Alert severity="error" onClose={packageDetails.refetch}>
                    {packageDetails.error}
                  </Alert>
                )}

                {packageDetails.loading && <Skeleton variant="text" />}

                {packageDetails.data && (
                  <Stack spacing={1.5}>
                    {packageDetails.data.whyChooseUs && (
                      <Box>
                        <Typography variant="subtitle2">Why choose us</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {packageDetails.data.whyChooseUs}
                        </Typography>
                      </Box>
                    )}

                    <Accordion disableGutters defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Images ({packageDetails.data.images.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.images.length > 0 ? (
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {packageDetails.data.images.map((item) => (
                              <Box key={item.id} sx={{ textAlign: 'center' }}>
                                <ImageCell
                                  src={resolveMediaUrl(item.image)}
                                  alt={item.title ?? 'package image'}
                                  size={72}
                                />
                                {item.title && (
                                  <Typography variant="caption" display="block">
                                    {item.title}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No images.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          What is included ({packageDetails.data.included.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.included.length > 0 ? (
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {packageDetails.data.included.map((item) => (
                              <Chip key={item.id} size="small" label={item.title} />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nothing listed.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Not included ({packageDetails.data.excluded.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.excluded.length > 0 ? (
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {packageDetails.data.excluded.map((item) => (
                              <Chip key={item.id} size="small" label={item.title} color="default" />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nothing listed.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          How it works ({packageDetails.data.howItWorks.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.howItWorks.length > 0 ? (
                          <Stack spacing={1}>
                            {packageDetails.data.howItWorks.map((item) => (
                              <Box key={item.id}>
                                <Typography variant="body2" fontWeight={600}>
                                  Step {item.step}: {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.description}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No steps defined.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Benefits ({packageDetails.data.benefits.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.benefits.length > 0 ? (
                          <Stack spacing={1}>
                            {packageDetails.data.benefits.map((item) => (
                              <Box key={item.id}>
                                <Typography variant="body2" fontWeight={600}>
                                  {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.description}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No benefits defined.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">FAQs ({packageDetails.data.faqs.length})</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {packageDetails.data.faqs.length > 0 ? (
                          <Stack spacing={1.5}>
                            {packageDetails.data.faqs.map((item) => (
                              <Box key={item.id}>
                                <Typography variant="body2" fontWeight={600}>
                                  {item.question}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.answer}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No FAQs.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={dialogOpen}
        title="Edit package"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save changes"
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormSelect
            label="Service"
            value={form.serviceId}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, serviceId: String(value), subCategoryId: '' }))
            }
            options={serviceOptions}
            required
          />
          <FormSelect
            label="Sub service"
            value={form.subCategoryId}
            onChange={(value) => setForm((prev) => ({ ...prev, subCategoryId: String(value) }))}
            options={subCategoryOptions}
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
              label="Default price"
              value={form.defaultPrice}
              onChange={(value) => setForm((prev) => ({ ...prev, defaultPrice: Number(value) }))}
              type="number"
              required
            />
            <FormInput
              label="Offer price"
              value={form.offerPrice ?? 0}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, offerPrice: value === '' ? null : Number(value) }))
              }
              type="number"
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormInput
              label="Duration (minutes)"
              value={form.durationMinutes}
              onChange={(value) => setForm((prev) => ({ ...prev, durationMinutes: Number(value) }))}
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
            previewUrl={record ? resolveMediaUrl(record.image) : null}
          />
        </Stack>
      </FormDialog>

      <FormDialog
        open={detailsDialogOpen}
        title="Package details"
        onClose={() => setDetailsDialogOpen(false)}
        onSubmit={handleSaveDetails}
        submitText="Save details"
        loading={savingDetails}
        maxWidth="md"
      >
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Alert severity="info">
            Saving replaces every existing detail row, so keep each list complete. Image fields take
            an already uploaded path or URL because this endpoint has no upload support.
          </Alert>

          <FormInput
            label="Detail description"
            value={details.description}
            onChange={(value) => setDetails((prev) => ({ ...prev, description: value }))}
            multiline
            rows={4}
          />

          <FormInput
            label="Why choose us"
            value={details.whyChooseUs}
            onChange={(value) => setDetails((prev) => ({ ...prev, whyChooseUs: value }))}
            multiline
            rows={3}
          />

          <RepeatableListField
            label="Images"
            fields={[
              { name: 'image', label: 'Image path or URL', required: true },
              { name: 'title', label: 'Title' },
            ]}
            value={details.images}
            onChange={(rows) => setDetails((prev) => ({ ...prev, images: rows }))}
            addLabel="Add image"
            emptyHint="No images yet."
          />

          <RepeatableListField
            label="What is included"
            fields={[
              { name: 'title', label: 'Title', required: true },
              { name: 'description', label: 'Description' },
              { name: 'image', label: 'Image path or URL' },
            ]}
            value={details.included}
            onChange={(rows) => setDetails((prev) => ({ ...prev, included: rows }))}
            addLabel="Add inclusion"
            emptyHint="Nothing listed."
          />

          <RepeatableListField
            label="Not included"
            fields={[
              { name: 'title', label: 'Title', required: true },
              { name: 'description', label: 'Description' },
              { name: 'image', label: 'Image path or URL' },
            ]}
            value={details.excluded}
            onChange={(rows) => setDetails((prev) => ({ ...prev, excluded: rows }))}
            addLabel="Add exclusion"
            emptyHint="Nothing listed."
          />

          <RepeatableListField
            label="How it works"
            fields={[
              { name: 'step', label: 'Step', type: 'number', required: true },
              { name: 'title', label: 'Title', required: true },
              { name: 'description', label: 'Description', required: true },
              { name: 'image', label: 'Image path or URL' },
            ]}
            value={details.howItWorks}
            onChange={(rows) => setDetails((prev) => ({ ...prev, howItWorks: rows }))}
            addLabel="Add step"
            emptyHint="No steps defined."
          />

          <RepeatableListField
            label="Benefits"
            fields={[
              { name: 'title', label: 'Title', required: true },
              { name: 'description', label: 'Description', required: true },
              { name: 'image', label: 'Image path or URL' },
            ]}
            value={details.benefits}
            onChange={(rows) => setDetails((prev) => ({ ...prev, benefits: rows }))}
            addLabel="Add benefit"
            emptyHint="No benefits defined."
          />

          <RepeatableListField
            label="FAQs"
            fields={[
              { name: 'question', label: 'Question', required: true, multiline: true },
              { name: 'answer', label: 'Answer', required: true, multiline: true },
            ]}
            value={details.faqs}
            onChange={(rows) => setDetails((prev) => ({ ...prev, faqs: rows }))}
            addLabel="Add FAQ"
            emptyHint="No FAQs."
          />
        </Stack>
      </FormDialog>
    </AdminLayout>
  );
}