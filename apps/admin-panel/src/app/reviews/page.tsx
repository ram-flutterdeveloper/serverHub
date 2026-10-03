'use client';

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { DeleteOutline, Edit, Reply, Refresh } from '@mui/icons-material';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import { reviewsService } from '@/services/reviews.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { RecordStatus, type Review, type ReviewUpdatePayload } from '@/types/api';
import { formatDateTime, getInitials, truncate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

const STATUS_OPTIONS = [
  { value: RecordStatus.ACTIVE, label: 'Active (public)' },
  { value: RecordStatus.INACTIVE, label: 'Inactive (hidden)' },
];

const emptyForm: ReviewUpdatePayload = {
  rating: 5,
  review: '',
  status: RecordStatus.ACTIVE,
  adminReply: '',
};

export default function ReviewsPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [editing, setEditing] = useState<Review | null>(null);
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [reply, setReply] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewUpdatePayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const reviews = useApiData((signal) => reviewsService.list(signal), []);

  const rows = useMemo(() => {
    let list = reviews.data ?? [];
    if (statusFilter !== 'ALL') {
      list = list.filter((item) => item.status === statusFilter);
    }
    if (ratingFilter !== 'ALL') {
      const min = Number(ratingFilter);
      list = list.filter((item) => item.rating === min);
    }
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) => {
      const user = `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.toLowerCase();
      return `${user} ${item.review ?? ''} ${item.provider?.businessName ?? ''} ${item.package?.name ?? ''}`
        .toLowerCase()
        .includes(term);
    });
  }, [reviews.data, search, statusFilter, ratingFilter]);

  const averageRating = useMemo(() => {
    const list = reviews.data ?? [];
    if (list.length === 0) return 0;
    return list.reduce((sum, item) => sum + Number(item.rating), 0) / list.length;
  }, [reviews.data]);

  const openEdit = (review: Review) => {
    setEditing(review);
    setForm({
      rating: Number(review.rating),
      review: review.review ?? '',
      status: review.status,
      adminReply: review.adminReply ?? '',
    });
  };

  const openReply = (review: Review) => {
    setReplyTarget(review);
    setReply(review.adminReply ?? '');
  };

  const handleEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await reviewsService.update(editing.id, form);
      showToast('Review updated successfully', 'success');
      setEditing(null);
      reviews.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update review', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReply = async () => {
    if (!replyTarget) return;
    setSaving(true);
    try {
      await reviewsService.update(replyTarget.id, { adminReply: reply });
      showToast('Reply published successfully', 'success');
      setReplyTarget(null);
      reviews.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to save reply', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await reviewsService.remove(deleteTarget.id);
      showToast('Review deleted successfully', 'success');
      setDeleteTarget(null);
      reviews.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete review', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Reviews"
        subtitle={
          reviews.data
            ? `${reviews.data.length} reviews • average rating ${averageRating.toFixed(2)}`
            : 'Customer reviews and admin replies'
        }
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reviews' }]}
        action={
          <Button startIcon={<Refresh />} onClick={reviews.refetch}>
            Refresh
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ minWidth: 200 }}>
          <FormSelect
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            options={[
              { value: 'ALL', label: 'All statuses' },
              { value: RecordStatus.ACTIVE, label: 'Active' },
              { value: RecordStatus.INACTIVE, label: 'Inactive' },
            ]}
          />
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <FormSelect
            label="Rating"
            value={ratingFilter}
            onChange={(value) => setRatingFilter(String(value))}
            options={[
              { value: 'ALL', label: 'All ratings' },
              { value: '5', label: '5 stars' },
              { value: '4', label: '4 stars' },
              { value: '3', label: '3 stars' },
              { value: '2', label: '2 stars' },
              { value: '1', label: '1 star' },
            ]}
          />
        </Box>
      </Stack>

      <DataTable
        rows={rows}
        clientPagination
        pageSize={25}
        loading={reviews.loading}
        error={reviews.error}
        onRetry={reviews.refetch}
        onSearch={setSearch}
        searchPlaceholder="Search reviews"
        emptyMessage="No reviews yet"
        columns={[
          {
            field: 'user',
            headerName: 'Customer',
            flex: 1,
            minWidth: 190,
            sortable: false,
            renderCell: (params) => {
              const review = params.row as Review;
              const name = `${review.user?.firstName ?? ''} ${review.user?.lastName ?? ''}`.trim();
              return (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
                  <Avatar
                    src={resolveMediaUrl(review.user?.profileImage) ?? undefined}
                    alt={name || 'Customer'}
                    sx={{ width: 34, height: 34, fontSize: 13 }}
                  >
                    {name ? getInitials(review.user!.firstName ?? '', review.user!.lastName ?? '') : '?'}
                  </Avatar>
                  <Typography variant="body2" noWrap>
                    {name || 'Deleted user'}
                  </Typography>
                </Stack>
              );
            },
          },
          {
            field: 'package',
            headerName: 'Package',
            flex: 0.9,
            minWidth: 160,
            sortable: false,
            valueGetter: (value: Review['package']) => value?.name ?? '—',
          },
          {
            field: 'provider',
            headerName: 'Provider',
            flex: 0.9,
            minWidth: 160,
            sortable: false,
            valueGetter: (value: Review['provider']) => value?.businessName ?? '—',
          },
          {
            field: 'rating',
            headerName: 'Rating',
            flex: 0.6,
            minWidth: 140,
            sortable: false,
            renderCell: (params) => (
              <Rating value={Number(params.value)} readOnly size="small" precision={0.5} />
            ),
          },
          {
            field: 'review',
            headerName: 'Review',
            flex: 1.4,
            minWidth: 220,
            sortable: false,
            valueGetter: (value: string | null) =>
              value ? truncate(value, 90) : 'No comment',
          },
          {
            field: 'adminReply',
            headerName: 'Admin reply',
            flex: 1,
            minWidth: 180,
            sortable: false,
            valueGetter: (value: string | null) => (value ? truncate(value, 60) : '—'),
          },
          {
            field: 'status',
            headerName: 'Status',
            flex: 0.6,
            minWidth: 110,
            sortable: false,
            renderCell: (params) => <StatusChip status={params.value as string} />,
          },
          {
            field: 'createdAt',
            headerName: 'Posted',
            flex: 0.7,
            minWidth: 140,
            sortable: false,
            valueGetter: (value: string) => formatDateTime(value),
          },
          {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.6,
            minWidth: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const review = params.row as Review;
              return (
                <Stack direction="row" spacing={0.5}>
                  <Button size="small" startIcon={<Edit />} onClick={() => openEdit(review)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Reply />}
                    onClick={() => openReply(review)}
                  >
                    Reply
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={() => setDeleteTarget(review)}
                  >
                    Delete
                  </Button>
                </Stack>
              );
            },
          },
        ]}
      />

      <FormDialog
        open={Boolean(editing)}
        title="Edit review"
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        submitText="Save changes"
        loading={saving}
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Rating
            </Typography>
            <Rating
              value={Number(form.rating)}
              onChange={(_, value) => setForm((prev) => ({ ...prev, rating: value ?? 1 }))}
            />
          </Box>

          <FormInput
            label="Review text"
            value={form.review ?? ''}
            onChange={(value) => setForm((prev) => ({ ...prev, review: value }))}
            multiline
            rows={3}
          />

          <FormSelect
            label="Visibility"
            value={form.status}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, status: String(value) as ReviewUpdatePayload['status'] }))
            }
            options={STATUS_OPTIONS}
          />

          <Alert severity="info">
            Reviews are created by customers after a completed booking. Admins can moderate them,
            edit the text, and publish a reply.
          </Alert>
        </Stack>
      </FormDialog>

      <Dialog open={Boolean(replyTarget)} onClose={() => setReplyTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle>Reply to review</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {replyTarget?.review && (
              <Alert severity="info" icon={false}>
                {replyTarget.review}
              </Alert>
            )}
            <FormInput
              label="Your reply"
              value={reply}
              onChange={setReply}
              multiline
              rows={4}
            />
            <Typography variant="caption" color="text.secondary">
              Saving sets `adminReplyAt` to the current time on the backend.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setReplyTarget(null)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleReply} disabled={saving}>
            Publish reply
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete review"
        message="This permanently removes the review from the platform."
        severity="error"
        confirmText="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}