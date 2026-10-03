'use client';

import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import {
  Block,
  CheckCircle,
  Refresh,
  ThumbDown,
  ThumbUp,
  VerifiedUser,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { GridColDef } from '@mui/x-data-grid';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import FormSelect from '@/components/common/FormSelect';
import DataTable from '@/components/tables/DataTable';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { providersService } from '@/services/providers.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { ProviderStatus, type AdminProvider } from '@/types/api';
import { formatDate } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

type ProviderAction = 'approve' | 'reject' | 'suspend' | 'activate' | 'verify-kyc';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: ProviderStatus.PENDING, label: 'Pending' },
  { value: ProviderStatus.ACTIVE, label: 'Active' },
  { value: ProviderStatus.REJECTED, label: 'Rejected' },
  { value: ProviderStatus.SUSPENDED, label: 'Suspended' },
];

export default function ProvidersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState<{ action: ProviderAction; provider: AdminProvider } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const providers = useApiData(
    (signal) => providersService.list({ page: page + 1, limit: pageSize, search, status }, signal),
    [page, pageSize, search, status],
  );

  const confirmMessage = () => {
    if (!pending) return '';
    switch (pending.action) {
      case 'approve':
        return `Approve ${pending.provider.businessName}? Their account becomes ACTIVE.`;
      case 'reject':
        return `Reject ${pending.provider.businessName}?`;
      case 'suspend':
        return `Suspend ${pending.provider.businessName}? The linked user account is also blocked.`;
      case 'activate':
        return `Reactivate ${pending.provider.businessName}?`;
      case 'verify-kyc':
        return `Mark the KYC documents of ${pending.provider.businessName} as approved?`;
      default:
        return '';
    }
  };

  const runAction = async () => {
    if (!pending) return;
    const { action, provider } = pending;
    setActionLoading(true);
    try {
      if (action === 'approve') await providersService.approve(provider.id);
      if (action === 'reject') await providersService.reject(provider.id);
      if (action === 'suspend') await providersService.suspend(provider.id);
      if (action === 'activate') await providersService.activate(provider.id);
      if (action === 'verify-kyc') await providersService.verifyKyc(provider.id);
      showToast('Provider updated successfully', 'success');
      setPending(null);
      providers.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'businessName',
        headerName: 'Provider',
        flex: 1.5,
        minWidth: 230,
        sortable: false,
        renderCell: (params) => {
          const provider = params.row as AdminProvider;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
              <UserAvatar
                firstName={provider.businessName?.[0] ?? ''}
                lastName=""
                avatar={resolveMediaUrl(provider.profileImage) ?? undefined}
                size={36}
              />
              <Box>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {provider.businessName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {provider.ownerName} · {provider.phone}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'experience',
        headerName: 'Experience',
        flex: 0.6,
        minWidth: 110,
        sortable: false,
        valueGetter: (value: number) => (value ? `${value} yrs` : '—'),
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
        field: 'isVerified',
        headerName: 'KYC',
        flex: 0.6,
        minWidth: 110,
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
        headerName: 'Applied',
        flex: 0.7,
        minWidth: 120,
        sortable: false,
        valueGetter: (value: string) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.8,
        minWidth: 210,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const provider = params.row as AdminProvider;
          const isPending = provider.status === ProviderStatus.PENDING;
          const isActive = provider.status === ProviderStatus.ACTIVE;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {isPending && (
                <>
                  <Tooltip title="Approve provider">
                    <Button
                      size="small"
                      color="success"
                      startIcon={<ThumbUp />}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPending({ action: 'approve', provider });
                      }}
                    >
                      Approve
                    </Button>
                  </Tooltip>
                  <Tooltip title="Reject provider">
                    <Button
                      size="small"
                      color="error"
                      startIcon={<ThumbDown />}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPending({ action: 'reject', provider });
                      }}
                    >
                      Reject
                    </Button>
                  </Tooltip>
                </>
              )}
              {isActive && (
                <Tooltip title="Suspend provider">
                  <Button
                    size="small"
                    color="warning"
                    startIcon={<Block />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPending({ action: 'suspend', provider });
                    }}
                  >
                    Suspend
                  </Button>
                </Tooltip>
              )}
              {!isActive && !isPending && (
                <Tooltip title="Reactivate provider">
                  <Button
                    size="small"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPending({ action: 'activate', provider });
                    }}
                  >
                    Activate
                  </Button>
                </Tooltip>
              )}
              {!provider.isVerified && (
                <Tooltip title="Verify KYC documents">
                  <Button
                    size="small"
                    color="info"
                    startIcon={<VerifiedUser />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPending({ action: 'verify-kyc', provider });
                    }}
                  >
                    KYC
                  </Button>
                </Tooltip>
              )}
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
        title="Providers"
        subtitle="Approve, suspend and verify service providers"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Providers' }]}
        action={
          <Button startIcon={<Refresh />} onClick={providers.refetch}>
            Refresh
          </Button>
        }
      />

      <DataTable
        rows={providers.data?.rows ?? []}
        columns={columns}
        loading={providers.loading}
        error={providers.error}
        onRetry={providers.refetch}
        totalRows={providers.data?.total ?? 0}
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
        searchPlaceholder="Search owner, mobile or email"
        onRowClick={(row: AdminProvider) => router.push(`/providers/${row.id}`)}
        toolbar={
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
        }
        emptyMessage="No providers match the current filters"
      />

      {providers.data && providers.data.total > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Showing {providers.data.rows.length} of {providers.data.total} providers.
        </Alert>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title="Please confirm"
        message={confirmMessage()}
        severity={pending?.action === 'reject' ? 'error' : 'warning'}
        loading={actionLoading}
        onCancel={() => setPending(null)}
        onConfirm={runAction}
      />
    </AdminLayout>
  );
}