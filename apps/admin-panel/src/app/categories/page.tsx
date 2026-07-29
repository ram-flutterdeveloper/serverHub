'use client';

import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Box,
  Switch,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import StatCard from '@/components/common/StatCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormDialog from '@/components/common/FormDialog';
import FormTextField from '@/components/common/FormTextField';
import { categorySchema } from '@/utils/validations';
import { dummyCategories } from '@/data/categories';
import type { Category } from '@/types';

type CategoryFormData = {
  name: string;
  description?: string;
  icon?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const addForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', icon: '' },
  });

  const editForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', icon: '' },
  });

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;

  const handleAdd = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: String(categories.length + 1),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || '',
      icon: data.icon || '',
      image: '',
      isActive: true,
      serviceCount: 0,
      subcategoryCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    setAddOpen(false);
    addForm.reset();
  };

  const handleEdit = (data: CategoryFormData) => {
    if (!selectedCategory) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selectedCategory.id
          ? { ...c, name: data.name, description: data.description || '', icon: data.icon || '' }
          : c
      )
    );
    setEditOpen(false);
    editForm.reset();
    setSelectedCategory(null);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
    setDeleteOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setEditOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Categories"
        description="Manage service categories"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add Category
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Total Categories" value={totalCategories} icon={<CategoryIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Active" value={activeCategories} icon={<CategoryIcon />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Inactive" value={inactiveCategories} icon={<CategoryIcon />} color="error" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {category.icon ? category.icon.charAt(0).toUpperCase() : <CategoryIcon />}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {category.name}
                    </Typography>
                    <StatusChip status={category.isActive ? 'active' : 'inactive'} />
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {category.description || 'No description'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {category.serviceCount} services
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category.subcategoryCount} subcategories
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1.5 }}>
                <Tooltip title={category.isActive ? 'Deactivate' : 'Activate'}>
                  <Switch
                    size="small"
                    checked={category.isActive}
                    onChange={() => handleToggleActive(category.id)}
                    color="primary"
                  />
                </Tooltip>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(category)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => openDelete(category)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Category"
        onSubmit={addForm.handleSubmit(handleAdd)}
      >
        <FormTextField
          control={addForm.control}
          name="name"
          label="Category Name"
          required
        />
        <FormTextField
          control={addForm.control}
          name="description"
          label="Description"
          multiline
          rows={3}
        />
        <FormTextField
          control={addForm.control}
          name="icon"
          label="Icon (text)"
          helperText="A single character or icon name"
        />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedCategory(null);
          editForm.reset();
        }}
        title="Edit Category"
        onSubmit={editForm.handleSubmit(handleEdit)}
      >
        <FormTextField
          control={editForm.control}
          name="name"
          label="Category Name"
          required
        />
        <FormTextField
          control={editForm.control}
          name="description"
          label="Description"
          multiline
          rows={3}
        />
        <FormTextField
          control={editForm.control}
          name="icon"
          label="Icon (text)"
          helperText="A single character or icon name"
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
      />
    </AdminLayout>
  );
}
