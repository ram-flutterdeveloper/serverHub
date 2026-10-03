'use client';

import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, Block, CheckCircle, DeleteOutline, Refresh, VerifiedUser } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { usersService } from '@/services/users.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { UserStatus } from '@/types/api';
import { formatDateTime, formatPhone } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

type UserAction = 'block' | 'unblock' | 'verify' | 'delete';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const { showToast } = useToast();

  const [pending, setPending] = useState<UserAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = useApiData((signal) => usersService.getById(userId, signal), [userId]);

  const runAction = async () => {
    if (!pending || !user.data) return;
    setActionLoading(true);
    try {
      if (pending === 'block') await usersService.block(user.data.id);
      if (pending === 'unblock') await usersService.unblock(user.data.id);
      if (pending === 'verify') await usersService.verify(user.data.id);
      if (pending === 'delete') await usersService.remove(user.data.id);
      showToast('Customer updated successfully', 'success');
      setPending(null);
      user.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmMessage = () => {
    if (!pending || !user.data) return '';
    const name = `${user.data.firstName ?? ''} ${user.data.lastName ?? ''}`.trim() || user.data.mobile;
    switch (pending) {
      case 'block':
        return `Block ${name}? They will not be able to sign in.`;
      case 'unblock':
        return `Unblock ${name}?`;
      case 'verify':
        return `Mark ${name} as verified?`;
      case 'delete':
        return `Delete ${name}? The backend performs a soft delete.`;
      default:
        return '';
    }
  };

  const isBlocked = user.data?.status === UserStatus.BLOCKED;
  const isDeleted = user.data?.status === UserStatus.DELETED;

  return (
    <AdminLayout>
      <PageHeader
        title="Customer details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Customers', path: '/users' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/users')}>
              Back
            </Button>
            <Button startIcon={<Refresh />} onClick={user.refetch}>
              Refresh
            </Button>
          </Stack>
        }
      />

      {user.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={user.refetch}>
          {user.error}
        </Alert>
      )}

      {user.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!user.loading && user.data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <UserAvatar
                  firstName={user.data.firstName ?? ''}
                  lastName={user.data.lastName ?? ''}
                  avatar={resolveMediaUrl(user.data.profileImage) ?? undefined}
                  size={88}
                />
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                  {`${user.data.firstName ?? ''} ${user.data.lastName ?? ''}`.trim() || 'Unnamed customer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.data.email ?? 'No email on file'}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                  <StatusChip status={user.data.status} />
                  <Chip
                    size="small"
                    label={user.data.role}
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={1}>
                  <Button
                    fullWidth
                    color={isBlocked ? 'success' : 'warning'}
                    variant="outlined"
                    startIcon={isBlocked ? <CheckCircle /> : <Block />}
                    disabled={isDeleted}
                    onClick={() => setPending(isBlocked ? 'unblock' : 'block')}
                  >
                    {isBlocked ? 'Unblock customer' : 'Block customer'}
                  </Button>
                  <Button
                    fullWidth
                    color="info"
                    variant="outlined"
                    startIcon={<VerifiedUser />}
                    disabled={isDeleted || (user.data.isMobileVerified && user.data.isEmailVerified)}
                    onClick={() => setPending('verify')}
                  >
                    Mark as verified
                  </Button>
                  <Button
                    fullWidth
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutline />}
                    disabled={isDeleted}
                    onClick={() => setPending('delete')}
                  >
                    Delete customer
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Account
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <DetailRow
                  label="Customer ID"
                  value={<Typography variant="body2" fontFamily="monospace">{user.data.id}</Typography>}
                />
                <DetailRow label="Mobile" value={formatPhone(user.data.mobile, user.data.countryCode)} />
                <DetailRow label="Email" value={user.data.email ?? '—'} />
                <DetailRow
                  label="Mobile verified"
                  value={user.data.isMobileVerified ? 'Yes' : 'No'}
                />
                <DetailRow
                  label="Email verified"
                  value={user.data.isEmailVerified ? 'Yes' : 'No'}
                />
                <DetailRow
                  label="Profile completed"
                  value={user.data.isProfileCompleted ? 'Yes' : 'No'}
                />
                <DetailRow label="Gender" value={user.data.gender ?? '—'} />
                <DetailRow
                  label="Date of birth"
                  value={user.data.dob ? formatDateTime(user.data.dob) : '—'}
                />
                <DetailRow label="Auth provider" value={user.data.authProvider} />
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Activity
                </Typography>
                <DetailRow label="Registered" value={formatDateTime(user.data.createdAt)} />
                <DetailRow label="Last updated" value={formatDateTime(user.data.updatedAt)} />
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 3 }}>
              Bookings, addresses and saved cards are not exposed for a customer by the admin API, so they
              are not shown on this page.
            </Alert>
          </Grid>
        </Grid>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title="Please confirm"
        message={confirmMessage()}
        severity={pending === 'block' || pending === 'delete' ? 'error' : 'warning'}
        loading={actionLoading}
        onCancel={() => setPending(null)}
        onConfirm={runAction}
      />
    </AdminLayout>
  );
}