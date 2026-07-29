'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Article,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyPages } from '@/data/cms';
import type { CMSPage as CMSPageType } from '@/types';
import { formatDate, generateSlug } from '@/utils';

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
});

type PageFormData = z.infer<typeof pageSchema>;

export default function CMSPage() {
  const [pages, setPages] = useState<CMSPageType[]>(dummyPages);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CMSPageType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CMSPageType | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { control, handleSubmit, reset, watch, setValue } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: '', slug: '', excerpt: '', content: '' },
  });

  const watchedTitle = watch('title');

  useEffect(() => {
    if (watchedTitle && !selectedPage) {
      setValue('slug', generateSlug(watchedTitle));
    }
  }, [watchedTitle, selectedPage, setValue]);

  const filtered = useMemo(() => {
    if (!search) return pages;
    const q = search.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [pages, search]);

  const handleOpenCreate = () => {
    setSelectedPage(null);
    reset({ title: '', slug: '', excerpt: '', content: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (page: CMSPageType) => {
    setSelectedPage(page);
    reset({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt,
      content: page.excerpt,
    });
    setDialogOpen(true);
  };

  const handleFormSubmit = (data: PageFormData) => {
    if (selectedPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === selectedPage.id
            ? { ...p, title: data.title, slug: data.slug, excerpt: data.excerpt, updatedAt: new Date().toISOString() }
            : p
        )
      );
      setSnackbar({ open: true, message: 'Page updated', severity: 'success' });
    } else {
      const newPage: CMSPageType = {
        id: `pg_${Date.now()}`,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        isPublished: false,
        updatedAt: new Date().toISOString(),
      };
      setPages((prev) => [newPage, ...prev]);
      setSnackbar({ open: true, message: 'Page created', severity: 'success' });
    }
    setDialogOpen(false);
    reset();
  };

  const handleTogglePublished = (page: CMSPageType) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === page.id ? { ...p, isPublished: !p.isPublished } : p
      )
    );
    setSnackbar({
      open: true,
      message: page.isPublished ? 'Page unpublished' : 'Page published',
      severity: 'success',
    });
  };

  const handleDelete = (page: CMSPageType) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      setDeleteDialogOpen(false);
      setPageToDelete(null);
      setSnackbar({ open: true, message: 'Page deleted', severity: 'success' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      minWidth: 200,
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
      field: 'slug',
      headerName: 'Slug',
      flex: 1.2,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          /{row.slug}
        </Typography>
      ),
    },
    {
      field: 'isPublished',
      headerName: 'Status',
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
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => formatDate(row.updatedAt),
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
        title="CMS Pages"
        subtitle="Manage content pages"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Page
          </Button>
        }
      />

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search pages by title, slug..."
        emptyMessage="No pages found."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedPage ? 'Edit Page' : 'Add Page'}
        onClose={() => {
          setDialogOpen(false);
          reset();
        }}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedPage ? 'Update' : 'Create'}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="title" control={control as Control<any>} label="Title" required />
          <FormTextField name="slug" control={control as Control<any>} label="Slug" required />
          <FormTextField name="excerpt" control={control as Control<any>} label="Excerpt" required />
          <FormTextField
            name="content"
            control={control as Control<any>}
            label="Content"
            multiline
            rows={6}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Page"
        message={`Are you sure you want to delete "${pageToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setPageToDelete(null);
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
