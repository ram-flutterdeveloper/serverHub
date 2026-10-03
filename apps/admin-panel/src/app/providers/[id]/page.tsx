'use client';

import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Link,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Block,
  CheckCircle,
  LocationOn,
  Percent,
  Refresh,
  ThumbDown,
  ThumbUp,
  VerifiedUser,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { providersService } from '@/services/providers.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { ProviderStatus } from '@/types/api';
import { formatDateTime } from '@/utils';
import { resolveMediaUrl } from '@/utils/media';

type ProviderAction = 'approve' | 'reject' | 'suspend' | 'activate' | 'verify-kyc';

interface ProviderDetail {
  locations?: {
    id: string;
    addressLine1: string;
    addressLine2: string | null;
    landmark: string | null;
    pincode: string;
    latitude: number;
    longitude: number;
    serviceRadius: number;
    isPrimary: boolean;
  }[];
  providerServices?: { id: string; serviceId: string; isActive: boolean }[];
  documents?: {
    id: string;
    documentType: string;
    documentNumber: string;
    frontImage: string;
    backImage: string | null;
    status: string;
    remarks: string | null;
  }[];
  workingHours?: {
    id: string;
    dayOfWeek: string;
    isOpen: boolean;
    openTime: string | null;
    closeTime: string | null;
  }[];
  bankAccounts?: {
    id: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: string;
    isPrimary: boolean;
    verificationStatus: string;
  }[];
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}

export default function ProviderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const providerId = params.id;
  const { showToast } = useToast();

  const [pending, setPending] = useState<ProviderAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [commission, setCommission] = useState('');

  const provider = useApiData((signal) => providersService.getById(providerId, signal), [providerId]);

  const detail = (provider.data ?? {}) as ProviderDetail;
  const isPending = provider.data?.status === ProviderStatus.PENDING;
  const isActive = provider.data?.status === ProviderStatus.ACTIVE;

  const confirmMessage = () => {
    if (!pending || !provider.data) return '';
    switch (pending) {
      case 'approve':
        return `Approve ${provider.data.businessName}? Their account becomes ACTIVE.`;
      case 'reject':
        return `Reject ${provider.data.businessName}?`;
      case 'suspend':
        return `Suspend ${provider.data.businessName}? The linked user account is blocked as well.`;
      case 'activate':
        return `Reactivate ${provider.data.businessName}?`;
      case 'verify-kyc':
        return `Approve the KYC documents of ${provider.data.businessName}?`;
      default:
        return '';
    }
  };

  const runAction = async () => {
    if (!pending || !provider.data) return;
    setActionLoading(true);
    try {
      if (pending === 'approve') await providersService.approve(provider.data.id);
      if (pending === 'reject') await providersService.reject(provider.data.id);
      if (pending === 'suspend') await providersService.suspend(provider.data.id);
      if (pending === 'activate') await providersService.activate(provider.data.id);
      if (pending === 'verify-kyc') await providersService.verifyKyc(provider.data.id);
      showToast('Provider updated successfully', 'success');
      setPending(null);
      provider.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const submitCommission = async () => {
    const value = Number(commission);
    if (!provider.data || Number.isNaN(value)) {
      showToast('Enter a valid commission value', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await providersService.updateCommission(provider.data.id, value);
      showToast('Commission updated successfully', 'success');
      setCommissionOpen(false);
      provider.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update commission', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Provider details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Providers', path: '/providers' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/providers')}>
              Back
            </Button>
            <Button startIcon={<Refresh />} onClick={provider.refetch}>
              Refresh
            </Button>
          </Stack>
        }
      />

      {provider.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={provider.refetch}>
          {provider.error}
        </Alert>
      )}

      {provider.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!provider.loading && provider.data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={resolveMediaUrl(provider.data.profileImage) ?? undefined}
                  sx={{ width: 88, height: 88, mx: 'auto', bgcolor: 'info.light' }}
                >
                  {provider.data.businessName?.[0] ?? 'P'}
                </Avatar>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                  {provider.data.businessName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {provider.data.ownerName}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                  <StatusChip status={provider.data.status} />
                  <Chip
                    size="small"
                    label={provider.data.isVerified ? 'KYC verified' : 'KYC pending'}
                    color={provider.data.isVerified ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={1}>
                  {isPending && (
                    <>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<ThumbUp />}
                        onClick={() => setPending('approve')}
                      >
                        Approve provider
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<ThumbDown />}
                        onClick={() => setPending('reject')}
                      >
                        Reject provider
                      </Button>
                    </>
                  )}
                  {isActive && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      startIcon={<Block />}
                      onClick={() => setPending('suspend')}
                    >
                      Suspend provider
                    </Button>
                  )}
                  {!isActive && !isPending && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => setPending('activate')}
                    >
                      Reactivate provider
                    </Button>
                  )}
                  {!provider.data.isVerified && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="info"
                      startIcon={<VerifiedUser />}
                      onClick={() => setPending('verify-kyc')}
                    >
                      Verify KYC
                    </Button>
                  )}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Percent />}
                    onClick={() => setCommissionOpen(true)}
                  >
                    Update commission
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title="Business" />
              <Divider />
              <CardContent>
                <DetailRow label="Phone" value={provider.data.phone} />
                <DetailRow label="Email" value={provider.data.email ?? '—'} />
                <DetailRow label="Experience" value={`${provider.data.experience} years`} />
                <DetailRow
                  label="Applied"
                  value={formatDateTime(provider.data.createdAt)}
                />
                <DetailRow label="Provider ID" value={<Typography variant="caption" fontFamily="monospace">{provider.data.id}</Typography>} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader title="About" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {provider.data.description ?? 'No description provided.'}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title="Service areas"
                  avatar={<LocationOn fontSize="small" />}
                />
                <Divider />
                <CardContent>
                  {detail.locations && detail.locations.length > 0 ? (
                    <Stack spacing={2}>
                      {detail.locations.map((location) => (
                        <Box key={location.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontWeight={600}>
                              {location.addressLine1}
                              {location.addressLine2 ? `, ${location.addressLine2}` : ''}
                            </Typography>
                            {location.isPrimary && <Chip size="small" label="Primary" color="primary" />}
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {location.landmark ? `${location.landmark} · ` : ''}
                            {location.pincode} · radius {location.serviceRadius} km
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No service area configured.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Services" />
                <Divider />
                <CardContent>
                  {detail.providerServices && detail.providerServices.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {detail.providerServices.map((service) => (
                        <Chip
                          key={service.id}
                          size="small"
                          label={service.serviceId}
                          color={service.isActive ? 'primary' : 'default'}
                          variant={service.isActive ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No services assigned.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Working hours" />
                <Divider />
                <CardContent>
                  {detail.workingHours && detail.workingHours.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detail.workingHours.map((hours) => (
                          <TableRow key={hours.id}>
                            <TableCell>{hours.dayOfWeek}</TableCell>
                            <TableCell>
                              <StatusChip
                                status={hours.isOpen ? 'ACTIVE' : 'INACTIVE'}
                                label={hours.isOpen ? 'Open' : 'Closed'}
                              />
                            </TableCell>
                            <TableCell>
                              {hours.isOpen ? `${hours.openTime ?? ''} – ${hours.closeTime ?? ''}` : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No working hours configured.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="KYC documents" />
                <Divider />
                <CardContent>
                  {detail.documents && detail.documents.length > 0 ? (
                    <Stack spacing={2}>
                      {detail.documents.map((document) => (
                        <Box
                          key={document.id}
                          sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
                        >
                          <Avatar
                            variant="rounded"
                            src={resolveMediaUrl(document.frontImage) ?? undefined}
                            sx={{ width: 64, height: 64 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 160 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {document.documentType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {document.documentNumber}
                              {document.remarks ? ` · ${document.remarks}` : ''}
                            </Typography>
                          </Box>
                          <StatusChip status={document.status} />
                          <Link
                            href={resolveMediaUrl(document.frontImage) ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            View
                          </Link>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Bank accounts" />
                <Divider />
                <CardContent>
                  {detail.bankAccounts && detail.bankAccounts.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Holder</TableCell>
                          <TableCell>Bank</TableCell>
                          <TableCell>Account</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detail.bankAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>
                              {account.accountHolderName}
                              {account.isPrimary ? ' (primary)' : ''}
                            </TableCell>
                            <TableCell>{account.bankName}</TableCell>
                            <TableCell>{account.accountNumber}</TableCell>
                            <TableCell>
                              <StatusChip status={account.verificationStatus} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No bank account on file.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {detail.bankAccounts === undefined && (
                <Alert severity="info">
                  The admin provider detail payload returns locations, services, documents and working
                  hours. Bank accounts are not part of that response.
                </Alert>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={commissionOpen}
        title="Update commission"
        onClose={() => setCommissionOpen(false)}
        onSubmit={submitCommission}
        submitText="Save commission"
        loading={actionLoading}
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Commission"
            type="number"
            value={commission}
            onChange={(event) => setCommission(event.target.value)}
            size="small"
            fullWidth
            helperText="Sent as `{ commission }` to PATCH /api/v1/admin/providers/:id/commission"
          />
          <Typography variant="caption" color="text.secondary">
            The Provider model has no commission column, so the backend may not persist this value.
          </Typography>
        </Stack>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Please confirm"
        message={confirmMessage()}
        severity={pending === 'reject' ? 'error' : 'warning'}
        loading={actionLoading}
        onCancel={() => setPending(null)}
        onConfirm={runAction}
      />
    </AdminLayout>
  );
}
