'use client';

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowBack, PersonAdd, Refresh } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import { bookingsService } from '@/services/bookings.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { BookingStatus, type AvailableProvider, type Booking } from '@/types/api';
import { formatCurrency, formatDateTime, formatPhone } from '@/utils';

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

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookingId = params.id;
  const { showToast } = useToast();

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [saving, setSaving] = useState(false);

  const booking = useApiData<Booking>(
    (signal) => bookingsService.getById(bookingId, signal),
    [bookingId],
  );

  const data = booking.data;
  const canAssign = data?.status === BookingStatus.PENDING;

  const availableProviders = useApiData<AvailableProvider[]>(
    (signal) => bookingsService.availableProviders(bookingId, signal),
    [bookingId, assignOpen],
  );

  const selectedProvider = useMemo(
    () => availableProviders.data?.find((provider) => provider.id === selectedProviderId),
    [availableProviders.data, selectedProviderId],
  );

  const openAssign = () => {
    setSelectedProviderId('');
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedProviderId) {
      showToast('Select a provider', 'error');
      return;
    }
    setSaving(true);
    try {
      await bookingsService.assignProvider(bookingId, { providerId: selectedProviderId });
      showToast('Provider assigned successfully', 'success');
      setAssignOpen(false);
      booking.refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to assign provider', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={data ? `Booking ${data.bookingNumber}` : 'Booking details'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Bookings', path: '/bookings' },
          { label: 'Details' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/bookings')}>
              Back
            </Button>
            <Button startIcon={<Refresh />} onClick={booking.refetch}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={openAssign}
              disabled={!canAssign}
            >
              Assign provider
            </Button>
          </Stack>
        }
      />

      {booking.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={booking.refetch}>
          {booking.error}
        </Alert>
      )}

      {booking.loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      )}

      {!booking.loading && data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardHeader title="Summary" />
              <Divider />
              <CardContent>
                <DetailRow label="Booking number" value={data.bookingNumber} />
                <DetailRow label="Status" value={<StatusChip status={data.status} />} />
                <DetailRow label="Payment" value={`${data.paymentMethod} • ${data.paymentStatus}`} />
                <DetailRow label="Schedule" value={`${formatDateTime(data.bookingDate)} • ${data.bookingTime}`} />
                <DetailRow label="Subtotal" value={formatCurrency(Number(data.subtotal))} />
                {Number(data.discount) > 0 && (
                  <DetailRow label="Discount" value={`- ${formatCurrency(Number(data.discount))}`} />
                )}
                {Number(data.tax) > 0 && (
                  <DetailRow label="Tax" value={formatCurrency(Number(data.tax))} />
                )}
                {Number(data.extraCharge) > 0 && (
                  <DetailRow label="Extra charge" value={formatCurrency(Number(data.extraCharge))} />
                )}
                <DetailRow
                  label="Total"
                  value={
                    <Typography variant="subtitle1" fontWeight={700}>
                      {formatCurrency(Number(data.totalAmount))}
                    </Typography>
                  }
                />
                <DetailRow label="Created" value={formatDateTime(data.createdAt)} />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title="Customer" />
              <Divider />
              <CardContent>
                {data.user ? (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      {`${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim() ||
                        data.user.mobile}
                    </Typography>
                    <DetailRow label="Mobile" value={data.user.mobile} />
                    {data.user.email && <DetailRow label="Email" value={data.user.email} />}
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => router.push(`/users/${data.userId}`)}
                    >
                      View customer
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Customer details are not part of the response.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title="Provider" />
              <Divider />
              <CardContent>
                {data.provider ? (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      {data.provider.businessName}
                    </Typography>
                    <DetailRow label="Owner" value={data.provider.ownerName} />
                    <DetailRow label="Phone" value={formatPhone(data.provider.phone)} />
                    <DetailRow
                      label="Assigned at"
                      value={data.assignedAt ? formatDateTime(data.assignedAt) : '—'}
                    />
                    {data.assignmentExpiresAt && (
                      <DetailRow
                        label="Assignment expires"
                        value={formatDateTime(data.assignmentExpiresAt)}
                      />
                    )}
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => router.push(`/providers/${data.providerId}`)}
                    >
                      View provider
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No provider assigned yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title={`Items (${data.items?.length ?? 0})`} />
              <Divider />
              <CardContent>
                {data.items && data.items.length > 0 ? (
                  <Stack spacing={2}>
                    {data.items.map((item) => {
                      const category = item.package?.service?.subCategory?.category?.name;
                      const subCategory = item.package?.service?.subCategory?.name;
                      const service = item.package?.service?.name;
                      return (
                        <Box
                          key={item.id}
                          sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {item.package?.name ?? 'Package removed'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {[category, subCategory, service].filter(Boolean).join(' • ') || '—'}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Typography variant="caption">
                              Qty {item.quantity} • {formatCurrency(Number(item.unitPrice))} each
                            </Typography>
                            <Typography variant="caption">{item.duration} min</Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {formatCurrency(Number(item.totalPrice))}
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No items.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardHeader title="Service address" />
              <Divider />
              <CardContent>
                {data.address ? (
                  <>
                    <Typography variant="body2">{data.address.addressLine}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {[data.address.houseNo, data.address.buildingName, data.address.floor]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {data.address.landmark ? `Landmark: ${data.address.landmark}` : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Contact: {data.address.contactPerson} • {data.address.contactNumber}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No address snapshot on this booking.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {data.notes && (
              <Card sx={{ mt: 3 }}>
                <CardHeader title="Customer notes" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {data.notes}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {data.requirements && data.requirements.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardHeader title={`Requirements (${data.requirements.length})`} />
                <Divider />
                <CardContent>
                  <Stack spacing={1}>
                    {data.requirements.map((requirement) => (
                      <Box key={requirement.id}>
                        <Typography variant="body2" fontWeight={600}>
                          {requirement.requirementTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {requirement.value}
                          {Number(requirement.extraPrice) > 0 &&
                            ` • + ${formatCurrency(Number(requirement.extraPrice))}`}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Card sx={{ mt: 3 }}>
              <CardHeader title={`Status history (${data.statusLogs?.length ?? 0})`} />
              <Divider />
              <CardContent>
                {data.statusLogs && data.statusLogs.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>When</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.statusLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <StatusChip status={log.status} />
                          </TableCell>
                          <TableCell>{log.remarks ?? '—'}</TableCell>
                          <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No status changes recorded.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <FormDialog
        open={assignOpen}
        title="Assign provider"
        onClose={() => setAssignOpen(false)}
        onSubmit={handleAssign}
        submitText="Assign provider"
        loading={saving}
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="info">
            The backend only accepts providers that are verified, offer the booked service, sit inside
            their service radius for this address and are free at the requested time. Assignment sets
            the booking to PROVIDER_ASSIGNED with a 5 minute expiry.
          </Alert>

          {availableProviders.error && (
            <Alert severity="error" onClose={availableProviders.refetch}>
              {availableProviders.error}
            </Alert>
          )}

          {availableProviders.loading ? (
            <Skeleton variant="text" />
          ) : availableProviders.data && availableProviders.data.length > 0 ? (
            <List dense sx={{ maxHeight: 320, overflow: 'auto' }}>
              {availableProviders.data.map((provider) => (
                <ListItemButton
                  key={provider.id}
                  selected={provider.id === selectedProviderId}
                  onClick={() => setSelectedProviderId(provider.id)}
                >
                  <ListItemText
                    primary={provider.businessName}
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="caption">
                          {provider.ownerName} • {provider.distance} km away
                        </Typography>
                        {provider.locations?.[0] && (
                          <Typography variant="caption" color="text.secondary">
                            {provider.locations[0].serviceRadius} km radius
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Alert severity="warning">
              No provider matches the service, radius, working hours and availability of this
              booking.
            </Alert>
          )}

          {selectedProvider && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={`${selectedProvider.providerServices?.length ?? 0} active services`}
              />
              {selectedProvider.locations?.[0] && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${selectedProvider.locations[0].addressLine1 || 'Primary location'} • ${selectedProvider.locations[0].serviceRadius} km radius`}
                />
              )}
              {selectedProvider.workingHours?.map((item) => (
                <Chip
                  key={item.id}
                  size="small"
                  variant="outlined"
                  label={
                    item.isOpen
                      ? `${item.dayOfWeek} ${item.openTime}-${item.closeTime}`
                      : `${item.dayOfWeek} closed`
                  }
                />
              ))}
            </Stack>
          )}
        </Stack>
      </FormDialog>
    </AdminLayout>
  );
}