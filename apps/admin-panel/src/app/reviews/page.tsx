'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Rating,
  Switch,
  Button,
  TextField,
} from '@mui/material';
import {
  Delete,
  Reply,
  RateReview,
  Star,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/tables/DataTable';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import FormSelect from '@/components/forms/FormSelect';
import { dummyReviews } from '@/data/reviews';
import { Review } from '@/types';
import { formatDate, formatRelativeTime, truncate } from '@/utils';

const ratingFilterOptions = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(dummyReviews);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filtered = useMemo(() => {
    let result = reviews;
    if (ratingFilter) {
      result = result.filter((r) => r.rating === Number(ratingFilter));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.providerName.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }
    return result;
  }, [reviews, search, ratingFilter]);

  const stats = useMemo(() => ({
    total: reviews.length,
    average: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0',
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
  }), [reviews]);

  const handleOpenDelete = (review: Review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setReplyDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedReview) {
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
      setDeleteDialogOpen(false);
      setSelectedReview(null);
      setSnackbar({ open: true, message: 'Review deleted successfully', severity: 'success' });
    }
  };

  const handleReplySubmit = () => {
    if (selectedReview) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id ? { ...r, reply: replyText } : r
        )
      );
      setReplyDialogOpen(false);
      setSelectedReview(null);
      setReplyText('');
      setSnackbar({ open: true, message: 'Reply saved successfully', severity: 'success' });
    }
  };

  const handleToggleVisible = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r))
    );
    const review = reviews.find((r) => r.id === id);
    setSnackbar({
      open: true,
      message: review?.isVisible ? 'Review hidden' : 'Review made visible',
      severity: 'success',
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1.2,
      minWidth: 140,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.customerName}
        </Typography>
      ),
    },
    {
      field: 'providerName',
      headerName: 'Provider',
      flex: 1.2,
      minWidth: 140,
    },
    {
      field: 'service',
      headerName: 'Service',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 1.2,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating value={row.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" fontWeight={600}>
            {row.rating}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Tooltip title={row.comment}>
          <Typography variant="body2" color="text.secondary">
            {truncate(row.comment, 60)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'isVisible',
      headerName: 'Visible',
      flex: 0.6,
      minWidth: 80,
      renderCell: ({ row }) => (
        <Switch
          size="small"
          checked={row.isVisible}
          onChange={() => handleToggleVisible(row.id)}
          color="primary"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Tooltip title={formatDate(row.createdAt)}>
          <Typography variant="body2" color="text.secondary">
            {formatRelativeTime(row.createdAt)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Reply">
            <IconButton size="small" color="primary" onClick={() => handleOpenReply(row)}>
              <Reply fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}>
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
        title="Reviews"
        subtitle="Manage customer reviews"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Reviews" value={stats.total} icon={<RateReview />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Average Rating" value={`${stats.average} ★`} icon={<Star />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="5 Star Reviews" value={stats.fiveStar} icon={<ThumbUp />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="1 Star Reviews" value={stats.oneStar} icon={<ThumbDown />} color="error" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search by customer, provider, service..."
        toolbar={
          // <FormSelect
          //   name="ratingFilter"
          //   control={{ _formValues: {}, _defaultValues: {}, _fieldValues: {} } as any}
          //   label="Rating"
          //   options={ratingFilterOptions}
          //   fullWidth={false}
          // />
          <FormSelect
            label="Rating"
            options={ratingFilterOptions}
            value={ratingFilter}
            onChange={(value) => {
              setRatingFilter(value as string);
            }}
            fullWidth={false}
            sx={{ minWidth: 160 }}
          />


        }
        onRowClick={(row) => router.push(`/reviews/${row.id}`)}
        emptyMessage="No reviews found matching your search."
      />

      <FormDialog
        open={replyDialogOpen}
        title="Reply to Review"
        onClose={() => { setReplyDialogOpen(false); setSelectedReview(null); setReplyText(''); }}
        onSubmit={handleReplySubmit}
        submitText="Save Reply"
      >
        <Box sx={{ pt: 1 }}>
          {selectedReview && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                {selectedReview.customerName} said:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                &quot;{selectedReview.comment}&quot;
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply to this review..."
            size="small"
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Review"
        message={`Are you sure you want to delete this review by "${selectedReview?.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedReview(null); }}
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
