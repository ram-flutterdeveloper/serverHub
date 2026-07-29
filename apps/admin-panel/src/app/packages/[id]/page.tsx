'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/common/FormDialog';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import { dummyPackages } from '@/data/packages';
import { dummySubServices } from '@/data/subServices';
import { formatCurrency, formatDate } from '@/utils';
import type { Package } from '@/types';

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceId: z.string().min(1, 'Service is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 hour'),
  features: z.string().min(1, 'At least one feature is required'),
});

type PackageFormData = z.infer<typeof packageSchema>;

export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [pkg, setPkg] = useState<Package | undefined>(
    dummyPackages.find((p) => p.id === id)
  );
  const [editOpen, setEditOpen] = useState(false);

  const editForm = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: pkg?.name || '',
      serviceId: pkg?.serviceId || '',
      description: pkg?.description || '',
      price: pkg?.price || 0,
      duration: pkg?.duration || 1,
      features: pkg?.features?.join(', ') || '',
    },
  });

  const serviceOptions = dummySubServices.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const service = dummySubServices.find((s) => s.id === pkg?.serviceId);

  const handleEdit = (data: PackageFormData) => {
    if (!pkg) return;
    const svc = dummySubServices.find((s) => s.id === data.serviceId);
    setPkg({
      ...pkg,
      name: data.name,
      serviceId: data.serviceId,
      serviceName: svc?.name || '',
      description: data.description || '',
      price: data.price,
      duration: data.duration,
      features: data.features.split(',').map((f) => f.trim()).filter(Boolean),
    });
    setEditOpen(false);
  };

  if (!pkg) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" gutterBottom>
            Package Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The package you are looking for does not exist or has been removed.
          </Typography>
          <Button component={Link} href="/packages" variant="contained">
            Back to Packages
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/packages" style={{ textDecoration: 'none', color: 'inherit' }}>
            Packages
          </Link>
          <Typography color="text.primary">{pkg.name}</Typography>
        </Breadcrumbs>
      </Box>

      <PageHeader
        title={pkg.name}
        description={pkg.description || 'Package details'}
        action={
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Edit Package
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 64, height: 64, fontSize: 24 }}>
                  {pkg.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5">{pkg.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <StatusChip status={pkg.isActive ? 'active' : 'inactive'} />
                    <Chip
                      label={formatCurrency(pkg.price)}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                      label={`${pkg.duration}h`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {pkg.description || 'No description provided.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              {pkg.features && pkg.features.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pkg.features.map((feature, index) => (
                    <Chip
                      key={index}
                      icon={<CheckIcon />}
                      label={feature}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No features listed.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Reference
              </Typography>
              {service ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Service Name</Typography>
                    <Typography variant="body2" fontWeight={500}>{service.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body2">{service.categoryName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <StatusChip status={service.isActive ? 'active' : 'inactive'} />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Service not found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Price</Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {formatCurrency(pkg.price)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography variant="body2">{pkg.duration} hours</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Bookings</Typography>
                <Chip label={pkg.bookings} size="small" color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Features</Typography>
                <Chip label={pkg.features?.length || 0} size="small" color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <StatusChip status={pkg.isActive ? 'active' : 'inactive'} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Package"
        onSubmit={editForm.handleSubmit(handleEdit)}
      >
        <FormTextField control={editForm.control} name="name" label="Package Name" required />
        <FormSelect
          control={editForm.control}
          name="serviceId"
          options={serviceOptions}
          label="Service"
          required
        />
        <FormTextField control={editForm.control} name="description" label="Description" multiline rows={2} />
        <FormTextField control={editForm.control} name="price" label="Price ($)" type="number" required />
        <FormTextField control={editForm.control} name="duration" label="Duration (hours)" type="number" required />
        <FormTextField
          control={editForm.control}
          name="features"
          label="Features (comma-separated)"
          multiline
          rows={2}
        />
      </FormDialog>
    </AdminLayout>
  );
}
