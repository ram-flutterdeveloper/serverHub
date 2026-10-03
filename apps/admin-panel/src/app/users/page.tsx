'use client';

import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Block, CheckCircle, DeleteOutline, Refresh, VerifiedUser } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { GridColDef } from '@mui/x-data-grid';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import FormSelect from '@/components/common/FormSelect';
import DataTable from '@/components/tables/DataTable';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { usersService } from '@/services/users.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { UserStatus, type AdminUser } from '@/types/api';
import { formatDate, formatPhone } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

type UserAction = 'block' | 'unblock' | 'verify' | 'delete';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: UserStatus.ACTIVE, label: 'Active' },
  { value: UserStatus.BLOCKED, label: 'Blocked' },
  { value: UserStatus.PENDING, label: 'Pending' },
  { value: UserStatus.DELETED, label: 'Deleted' },
];

export default function UsersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState<{ action: UserAction; user: AdminUser } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const users = useApiData(
    (signal) => usersService.list({ page: page + 1, limit: pageSize, search, status }, signal),
    [page, pageSize, search, status],
  );

  const displayName = (user: AdminUser) =>
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || formatPhone(user.mobile, user.countryCode);

  const confirmMessage = () => {
    if (!pending) return '';
    const name = displayName(pending.user);
    switch (pending.action) {
      case 'block':
        return `Block ${name}? The customer will not be able to sign in until unblocked.`;
      case 'unblock':
        return `Unblock ${name}?`;
      case 'verify':
        return `Mark ${name} as verified (mobile + email)?`;
      case 'delete':
        return `Delete ${name}? The backend performs a soft delete.`;
      default:
        return '';
    }
  };

  const runAction = async () => {
    if (!pending) return;
    const { action, user } = pending;
    setActionLoading(true);
    try {
      if (action === 'block') await usersService.block(user.id);
      if (action === 'unblock') await usersService.unblock(user.id);
      if (action === 'verify') await usersService.verify(user.id);
      if (action === 'delete') await usersService.remove(user.id);
      showToast('Customer updated successfully', 'success');
      setPending(null);
      users.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'name',
        headerName: 'Customer',
        flex: 1.4,
        minWidth: 220,
        sortable: false,
        renderCell: (params) => {
          const user = params.row;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
              <UserAvatar
                firstName={user.firstName ?? ''}
                lastName={user.lastName ?? ''}
                avatar={resolveMediaUrl(user.profileImage) ?? undefined}
                size={36}
              />
              <Box>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {displayName(user)}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.email ?? formatPhone(user.mobile, user.countryCode)}
                </Typography>
              </Box>
            </Box>
          );
        },
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
        field: 'isMobileVerified',
        headerName: 'Verification',
        flex: 0.7,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <StatusChip
            status={params.value ? 'ACTIVE' : 'PENDING'}
            label={params.value ? 'Verified' : 'Unverified'}
          />
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Joined',
        flex: 0.7,
        minWidth: 120,
        sortable: false,
        valueGetter: (value: string) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.6,
        minWidth: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const user = params.row;
          const isBlocked = user.status === UserStatus.BLOCKED;
          const isDeleted = user.status === UserStatus.DELETED;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title={isBlocked ? 'Unblock customer' : 'Block customer'}>
                <IconButton
                  size="small"
                  color={isBlocked ? 'success' : 'warning'}
                  disabled={isDeleted}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPending({ action: isBlocked ? 'unblock' : 'block', user });
                  }}
                >
                  {isBlocked ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Mark as verified">
                <IconButton
                  size="small"
                  color="info"
                  disabled={user.isMobileVerified && user.isEmailVerified}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPending({ action: 'verify', user });
                  }}
                >
                  <VerifiedUser fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete customer">
                <IconButton
                  size="small"
                  color="error"
                  disabled={isDeleted}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPending({ action: 'delete', user });
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
     
    [],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Customers"
        subtitle="Registered customer accounts"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Customers' }]}
        action={
          <Button startIcon={<Refresh />} onClick={() => users.refetch()}>
            Refresh
          </Button>
        }
      />

      <DataTable
        rows={users.data?.rows ?? []}
        columns={columns}
        loading={users.loading}
        error={users.error}
        onRetry={users.refetch}
        totalRows={users.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0);
        }}
        onSearch={(value) => {
          setSearch(value);
          setPage(0);
        }}
        searchPlaceholder="Search name, email or mobile"
        onRowClick={(row: AdminUser) => router.push(`/users/${row.id}`)}
        toolbar={
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ minWidth: 170 }}>
              <FormSelect
                label="Status"
                value={status}
                onChange={(value) => {
                  setStatus(value as string);
                  setPage(0);
                }}
                options={STATUS_OPTIONS}
              />
            </Box>
          </Stack>
        }
        emptyMessage="No customers match the current filters"
      />

      {users.data && users.data.total > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Showing {users.data.rows.length} of {users.data.total} customers.
        </Alert>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title="Please confirm"
        message={confirmMessage()}
        severity={pending?.action === 'block' || pending?.action === 'delete' ? 'error' : 'warning'}
        loading={actionLoading}
        onCancel={() => setPending(null)}
        onConfirm={runAction}
      />
    </AdminLayout>
  );
}