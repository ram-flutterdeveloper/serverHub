'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Article,
  Visibility as VisibilityIcon,
  Drafts,
  PublishedWithChanges,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyBlogs } from '@/data/cms';
import { Blog } from '@/types';
import { formatDate } from '@/utils';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

const categoryOptions = [
  { value: 'Home Maintenance', label: 'Home Maintenance' },
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Cleaning', label: 'Cleaning' },
  { value: 'Painting', label: 'Painting' },
  { value: 'Pest Control', label: 'Pest Control' },
  { value: 'Home Security', label: 'Home Security' },
  { value: 'Moving', label: 'Moving' },
  { value: 'Appliance Repair', label: 'Appliance Repair' },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(dummyBlogs);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { control, handleSubmit, reset } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: '', excerpt: '', author: '', category: '', content: '' },
  });

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category));
    return ['All', ...Array.from(cats)];
  }, [blogs]);

  const stats = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((b) => b.isPublished).length,
      draft: blogs.filter((b) => !b.isPublished).length,
      totalViews: blogs.reduce((sum, b) => sum + b.views, 0),
    }),
    [blogs]
  );

  const filtered = useMemo(() => {
    let result = blogs;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((b) => b.category === categoryFilter);
    }

    return result;
  }, [blogs, search, categoryFilter]);

  const handleOpenCreate = () => {
    setSelectedBlog(null);
    reset({ title: '', excerpt: '', author: '', category: '', content: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    reset({
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      content: blog.excerpt,
    });
    setDialogOpen(true);
  };

  const handleFormSubmit = (data: BlogFormData) => {
    if (selectedBlog) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === selectedBlog.id
            ? {
                ...b,
                title: data.title,
                excerpt: data.excerpt,
                author: data.author,
                category: data.category,
              }
            : b
        )
      );
      setSnackbar({ open: true, message: 'Blog updated', severity: 'success' });
    } else {
      const newBlog: Blog = {
        // eslint-disable-next-line react-hooks/purity -- submit handler, not render
        id: `blg_${Date.now()}`,
        title: data.title,
        slug: data.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-'),
        excerpt: data.excerpt,
        author: data.author,
        category: data.category,
        isPublished: false,
        views: 0,
        createdAt: new Date().toISOString(),
      };
      setBlogs((prev) => [newBlog, ...prev]);
      setSnackbar({ open: true, message: 'Blog created', severity: 'success' });
    }
    setDialogOpen(false);
    reset();
  };

  const handleTogglePublished = (blog: Blog) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blog.id ? { ...b, isPublished: !b.isPublished } : b
      )
    );
    setSnackbar({
      open: true,
      message: blog.isPublished ? 'Blog unpublished' : 'Blog published',
      severity: 'success',
    });
  };

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      setSnackbar({ open: true, message: 'Blog deleted', severity: 'success' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Article fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={600}>
            {row.title}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <Chip label={row.category} size="small" variant="outlined" />
      ),
    },
    {
      field: 'isPublished',
      headerName: 'Published',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Chip
          label={row.isPublished ? 'Published' : 'Draft'}
          color={row.isPublished ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'views',
      headerName: 'Views',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={500}>
          {row.views.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 130,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.isPublished ? 'Unpublish' : 'Publish'}>
            <IconButton
              size="small"
              color={row.isPublished ? 'warning' : 'success'}
              onClick={() => handleTogglePublished(row)}
            >
              {row.isPublished ? (
                <ToggleOff fontSize="small" />
              ) : (
                <ToggleOn fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Blog Posts"
        subtitle="Manage blog content"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Blog
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Posts" value={stats.total} icon={<Article />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Published" value={stats.published} icon={<PublishedWithChanges />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Draft" value={stats.draft} icon={<Drafts />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Views" value={stats.totalViews.toLocaleString()} icon={<VisibilityIcon />} color="info" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search blogs by title, author, category..."
        emptyMessage="No blog posts found."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedBlog ? 'Edit Blog' : 'Add Blog'}
        onClose={() => {
          setDialogOpen(false);
          reset();
        }}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedBlog ? 'Update' : 'Create'}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="title" control={control as Control<BlogFormData>} label="Title" required />
          <FormTextField name="excerpt" control={control as Control<BlogFormData>} label="Excerpt" required />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormTextField name="author" control={control as Control<BlogFormData>} label="Author" required />
            <FormSelect
              name="category"
              control={control as Control<BlogFormData>}
              label="Category"
              options={categoryOptions}
              required
            />
          </Box>
          <FormTextField
            name="content"
            control={control as Control<BlogFormData>}
            label="Content"
            multiline
            rows={6}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Blog"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setBlogToDelete(null);
        }}
        severity="error"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
