'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  MarkEmailRead,
  CalendarMonth,
  Payment,
  Settings,
  Campaign,
  RateReview,
  Warning,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { dummyNotifications } from '@/data/notifications';
import { Notification, NotificationType } from '@/types';
import { formatDate, formatRelativeTime } from '@/utils';

const typeIconMap: Record<string, React.ReactElement> = {
  [NotificationType.BOOKING]: <CalendarMonth />,
  [NotificationType.PAYMENT]: <Payment />,
  [NotificationType.SYSTEM]: <Settings />,
  [NotificationType.PROMOTION]: <Campaign />,
  [NotificationType.REVIEW]: <RateReview />,
  [NotificationType.ALERT]: <Warning />,
};

const typeColorMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'error'> = {
  [NotificationType.BOOKING]: 'primary',
  [NotificationType.PAYMENT]: 'success',
  [NotificationType.SYSTEM]: 'info',
  [NotificationType.PROMOTION]: 'warning',
  [NotificationType.REVIEW]: 'primary',
  [NotificationType.ALERT]: 'error',
};

export default function NotificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const notificationId = params.id as string;

  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const notification = useMemo(
    () => notifications.find((n) => n.id === notificationId),
    [notifications, notificationId]
  );

  const handleMarkRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setSnackbar({ open: true, message: 'Marked as read', severity: 'success' });
  };

  if (!notification) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Notification not found
        </Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title={notification.title}
        subtitle={formatRelativeTime(notification.createdAt)}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Notifications', path: '/notifications' },
          { label: notification.title },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/notifications')}>
            Back to Notifications
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {notification.title}
                  </Typography>
                  <Chip
                    label={notification.type}
                    size="small"
                    color={typeColorMap[notification.type] || 'primary'}
                    icon={typeIconMap[notification.type]}
                  />
                  <StatusChip
                    status={notification.isRead ? 'active' : 'pending'}
                    label={notification.isRead ? 'Read' : 'Unread'}
                    size="medium"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Message
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 3 }}>
                {notification.message}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Notification Info
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Type"
                    secondary={
                      <Chip
                        label={notification.type}
                        size="small"
                        color={typeColorMap[notification.type] || 'primary'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    }
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarMonth color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={`${formatDate(notification.createdAt)} (${formatRelativeTime(notification.createdAt)})`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {notification.isRead ? (
                      <MarkEmailRead color="success" />
                    ) : (
                      <NotificationsIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={notification.isRead ? 'Read' : 'Unread'}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {!notification.isRead && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<MarkEmailRead />}
                  fullWidth
                  onClick={handleMarkRead}
                >
                  Mark as Read
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

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
