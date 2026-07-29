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
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
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
import { dummySubServices } from '@/data/subServices';
import { dummyCategories } from '@/data/categories';
import { formatDate } from '@/utils';
import type { SubService } from '@/types';

const subServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

type SubServiceFormData = z.infer<typeof subServiceSchema>;

export default function SubServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [subService, setSubService] = useState<SubService | undefined>(
    dummySubServices.find((s) => s.id === id)
  );
  const [editOpen, setEditOpen] = useState(false);

  const editForm = useForm<SubServiceFormData>({
    resolver: zodResolver(subServiceSchema),
    defaultValues: {
      name: subService?.name || '',
      categoryId: subService?.categoryId || '',
      description: subService?.description || '',
    },
  });

  const categoryOptions = dummyCategories.map((c) => ({ value: c.id, label: c.name }));

  const category = dummyCategories.find((c) => c.id === subService?.categoryId);

  const handleEdit = (data: SubServiceFormData) => {
    if (!subService) return;
    const cat = dummyCategories.find((c) => c.id === data.categoryId);
    setSubService({
      ...subService,
      name: data.name,
      categoryId: data.categoryId,
      categoryName: cat?.name || '',
      description: data.description || '',
    });
    setEditOpen(false);
  };

  if (!subService) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" gutterBottom>
            Sub Service Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The sub-service you are looking for does not exist or has been removed.
          </Typography>
          <Button component={Link} href="/sub-services" variant="contained">
            Back to Sub Services
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/sub-services" style={{ textDecoration: 'none', color: 'inherit' }}>
            Sub Services
          </Link>
          <Typography color="text.primary">{subService.name}</Typography>
        </Breadcrumbs>
      </Box>

      <PageHeader
        title={subService.name}
        description={subService.description || 'Sub-service details'}
        action={
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, fontSize: 24 }}>
                  {subService.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5">{subService.name}</Typography>
                  <StatusChip status={subService.isActive ? 'active' : 'inactive'} />
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {subService.description || 'No description provided.'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Information
              </Typography>
              {category ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Category Name</Typography>
                    <Typography variant="body2" fontWeight={500}>{category.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body2">{category.description || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <StatusChip status={category.isActive ? 'active' : 'inactive'} />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Category not found.</Typography>
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
                <Typography variant="body2" color="text.secondary">Services</Typography>
                <Chip label={subService.serviceCount} size="small" color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <StatusChip status={subService.isActive ? 'active' : 'inactive'} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body2">{formatDate(subService.createdAt)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Sub Service"
        onSubmit={editForm.handleSubmit(handleEdit)}
      >
        <FormTextField control={editForm.control} name="name" label="Name" required />
        <FormSelect
          control={editForm.control}
          name="categoryId"
          options={categoryOptions}
          label="Category"
          required
        />
        <FormTextField control={editForm.control} name="description" label="Description" multiline rows={3} />
      </FormDialog>
    </AdminLayout>
  );
}
