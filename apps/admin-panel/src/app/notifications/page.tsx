'use client';

import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { NotificationsActive, Refresh } from '@mui/icons-material';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import {
  NOTIFICATIONS_MISSING_ENDPOINTS,
  notificationsService,
} from '@/services/notifications.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { Notification, RegisterDevicePayload } from '@/types/api';
import { formatDateTime } from '@/utils';

const PLATFORM_OPTIONS = [
  { value: 'WEB', label: 'Web' },
  { value: 'ANDROID', label: 'Android' },
  { value: 'IOS', label: 'iOS' },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [platform, setPlatform] = useState<RegisterDevicePayload['platform']>('WEB');
  const [token, setToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [saving, setSaving] = useState(false);

  const notifications = useApiData<Notification[]>(
    (signal) => notificationsService.list(signal),
    [],
  );

  const isListUnavailable = notifications.error !== null;

  const deviceIdHint = useMemo(() => {
    if (typeof window === 'undefined') return 'browser storage id';
    return window.localStorage.getItem('servicehub_device_id') ?? 'browser storage id';
  }, []);

  const handleRegister = async () => {
    if (!token.trim()) {
      showToast('Paste the FCM registration token', 'error');
      return;
    }
    if (!deviceId.trim()) {
      showToast('A device id is required by the backend', 'error');
      return;
    }
    setSaving(true);
    try {
      await notificationsService.registerDevice({
        platform,
        token: token.trim(),
        deviceId: deviceId.trim(),
      });
      showToast('Device registered for push notifications', 'success');
      setToken('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to register device', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        subtitle="Push channel registration and delivery status"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Notifications' }]}
        action={
          <Button startIcon={<Refresh />} onClick={notifications.refetch}>
            Refresh
          </Button>
        }
      />

      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Backend API required but unavailable
        </Typography>
        <Typography variant="body2">
          Only <code>POST /api/v1/notifications/register-device</code> is mounted. The notification
          routes file is empty on the backend, so no inbox, unread count or read state can be
          loaded. Browser push also needs a Firebase web config, which this project does not ship.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {NOTIFICATIONS_MISSING_ENDPOINTS.map((endpoint) => (
            <Chip key={endpoint} size="small" label={endpoint} variant="outlined" />
          ))}
        </Stack>
      </Alert>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardHeader
            title="Register a device"
            subheader={`Registers the signed-in admin${user?.email ? ` (${user.email})` : ''}`}
            action={<NotificationsActive color="action" />}
          />
          <CardContent>
            <Stack spacing={2.5}>
              <FormSelect
                label="Platform"
                value={platform}
                onChange={(value) =>
                  setPlatform(String(value) as RegisterDevicePayload['platform'])
                }
                options={PLATFORM_OPTIONS}
              />

              <FormInput
                label="Device id"
                value={deviceId}
                onChange={setDeviceId}
                placeholder={deviceIdHint}
                helperText="The backend upserts on (userId, deviceId)"
              />

              <FormInput
                label="FCM token"
                value={token}
                onChange={setToken}
                multiline
                rows={3}
                placeholder="Paste the Firebase Cloud Messaging registration token"
                helperText="Required. Generate it from a Firebase web app; this panel has no bundled Firebase SDK."
              />

              <Box>
                <Button variant="contained" onClick={handleRegister} disabled={saving}>
                  {saving ? 'Registering…' : 'Register device'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardHeader title="Inbox" subheader="Notifications sent to the admin account" />
          <CardContent>
            {notifications.loading && (
              <Typography variant="body2" color="text.secondary">
                Loading…
              </Typography>
            )}

            {!notifications.loading && isListUnavailable && (
              <Alert severity="error">{notifications.error}</Alert>
            )}

            {!notifications.loading && !isListUnavailable && (
              <Stack spacing={1.5}>
                {notifications.data && notifications.data.length > 0 ? (
                  notifications.data.map((notification) => (
                    <Box
                      key={notification.id}
                      sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.body}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDateTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No notifications returned.
                  </Typography>
                )}
              </Stack>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              Booking assignment notifications are emitted by the backend through
              <code> notificationEventService.bookingAssigned</code> when a provider is assigned, but
              they are delivered through Firebase to registered devices only.
            </Alert>
          </CardContent>
        </Card>
      </Stack>
    </AdminLayout>
  );
}