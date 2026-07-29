'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Breadcrumbs,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormDialog from '@/components/common/FormDialog';
import FormTextField from '@/components/common/FormTextField';
import { categorySchema } from '@/utils/validations';
import { dummyCategories } from '@/data/categories';
import { dummySubServices } from '@/data/subServices';
import { formatDate } from '@/utils';
import type { Category } from '@/types';
import type { SubService } from '@/types';

type CategoryFormData = {
  name: string;
  description?: string;
  icon?: string;
};

type SubCategoryFormData = {
  name: string;
  description: string;
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [category, setCategory] = useState<Category | undefined>(
    dummyCategories.find((c) => c.id === id)
  );
  const [editOpen, setEditOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [deleteSubOpen, setDeleteSubOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubService | null>(null);

  const subCategories = dummySubServices.filter((s) => s.categoryId === id);

  const editForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || '',
    },
  });

  const subForm = useForm<SubCategoryFormData>({
    defaultValues: { name: '', description: '' },
  });

  const handleEditCategory = (data: CategoryFormData) => {
    if (!category) return;
    setCategory({ ...category, name: data.name, description: data.description || '', icon: data.icon || '' });
    setEditOpen(false);
  };

  const handleAddSubCategory = (data: SubCategoryFormData) => {
    setAddSubOpen(false);
    subForm.reset();
  };

  const handleDeleteSub = () => {
    setDeleteSubOpen(false);
    setSelectedSub(null);
  };

  if (!category) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Category Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The category you are looking for does not exist or has been removed.
          </Typography>
          <Button component={Link} href="/categories" variant="contained">
            Back to Categories
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
            Categories
          </Link>
          <Typography color="text.primary">{category.name}</Typography>
        </Breadcrumbs>
      </Box>

      <PageHeader
        title={category.name}
        subtitle={category.description || 'Category details'}
        action={
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Edit Category
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 64,
                    height: 64,
                    fontSize: 28,
                  }}
                >
                  {category.icon ? category.icon.charAt(0).toUpperCase() : <CategoryIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h5">{category.name}</Typography>
                  <StatusChip status={category.isActive ? 'active' : 'inactive'} />
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {category.description || 'No description provided.'}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Created: {formatDate(category.createdAt)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Subcategories</Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => setAddSubOpen(true)}
                >
                  Add Subcategory
                </Button>
              </Box>

              {subCategories.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No subcategories found for this category.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Services</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subCategories.map((sub) => (
                        <TableRow key={sub.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {sub.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{sub.serviceCount}</TableCell>
                          <TableCell>
                            <StatusChip status={sub.isActive ? 'active' : 'inactive'} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{formatDate(sub.createdAt)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedSub(sub);
                                  setDeleteSubOpen(true);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                <Chip label={category.serviceCount} size="small" color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Subcategories</Typography>
                <Chip label={category.subcategoryCount} size="small" color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <StatusChip status={category.isActive ? 'active' : 'inactive'} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body2">{formatDate(category.createdAt)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Category"
        onSubmit={editForm.handleSubmit(handleEditCategory)}
      >
        <FormTextField control={editForm.control} name="name" label="Category Name" required />
        <FormTextField control={editForm.control} name="description" label="Description" multiline rows={3} />
        <FormTextField control={editForm.control} name="icon" label="Icon (text)" />
      </FormDialog>

      <FormDialog
        open={addSubOpen}
        onClose={() => setAddSubOpen(false)}
        title="Add Subcategory"
        onSubmit={subForm.handleSubmit(handleAddSubCategory)}
      >
        <FormTextField control={subForm.control} name="name" label="Subcategory Name" required />
        <FormTextField control={subForm.control} name="description" label="Description" multiline rows={3} />
      </FormDialog>

      <ConfirmDialog
        open={deleteSubOpen}
        onClose={() => {
          setDeleteSubOpen(false);
          setSelectedSub(null);
        }}
        onConfirm={handleDeleteSub}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${selectedSub?.name}"?`}
        confirmText="Delete"
        severity="error"
      />
    </AdminLayout>
  );
}
