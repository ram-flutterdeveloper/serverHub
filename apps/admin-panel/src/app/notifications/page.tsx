'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Badge,
  Chip,
} from '@mui/material';
import {
  Add,
  Notifications as NotificationsIcon,
  Delete,
  MarkEmailRead,
  CalendarMonth,
  Payment,
  Settings,
  Campaign,
  RateReview,
  Warning,
  Circle,
} from '@mui/icons-material';
import { useForm, Control } from 'react-hook-form';
import { z } from 'zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import FormDialog from '@/components/dialogs/FormDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { dummyNotifications } from '@/data/notifications';
import { Notification, NotificationType } from '@/types';
import { formatRelativeTime } from '@/utils';

const notificationTypeOptions = Object.values(NotificationType).map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.string().min(1, 'Type is required'),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [activeTab, setActiveTab] = useState(0);
  const [sendOpen, setSendOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<NotificationFormValues>({
    defaultValues: { title: '', message: '', type: '' },
  });

  const filtered = useMemo(() => {
    if (activeTab === 1) {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
  }), [notifications]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setSnackbar({ open: true, message: 'All notifications marked as read', severity: 'success' });
  };

  const handleOpenDelete = (notification: Notification) => {
    setDeleteTarget(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setSnackbar({ open: true, message: 'Notification deleted', severity: 'success' });
    }
  };

  const handleSendSubmit = (data: NotificationFormValues) => {
    const newNotification: Notification = {
      id: `ntf_${String(notifications.length + 1).padStart(3, '0')}`,
      title: data.title,
      message: data.message,
      type: data.type as NotificationType,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setSendOpen(false);
    reset();
    setSnackbar({ open: true, message: 'Notification sent successfully', severity: 'success' });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        subtitle="Manage notifications"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {stats.unread > 0 && (
              <Button variant="outlined" startIcon={<MarkEmailRead />} onClick={handleMarkAllRead}>
                Mark All Read
              </Button>
            )}
            <Button variant="contained" startIcon={<Add />} onClick={() => setSendOpen(true)}>
              Send Notification
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Total" value={stats.total} icon={<NotificationsIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Unread" value={stats.unread} icon={<MarkEmailRead />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Read" value={stats.read} icon={<NotificationsIcon />} color="success" />
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab
              label={
                <Badge badgeContent={stats.total} color="primary" max={999}>
                  All
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={stats.unread} color="error" max={999}>
                  Unread
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No notifications to display.
              </Typography>
            </Box>
          ) : (
            filtered.map((notification, index) => (
              <Box
                key={notification.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2.5,
                  px: 3,
                  borderBottom: index < filtered.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ mt: 0.5, position: 'relative' }}>
                  {!notification.isRead && (
                    <Circle
                      sx={{
                        fontSize: 10,
                        color: 'primary.main',
                        position: 'absolute',
                        top: -2,
                        right: -2,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: `${typeColorMap[notification.type] || 'primary'}.light`,
                      color: `${typeColorMap[notification.type] || 'primary'}.main`,
                      display: 'flex',
                    }}
                  >
                    {typeIconMap[notification.type] || <NotificationsIcon />}
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      fontWeight={notification.isRead ? 400 : 700}
                      noWrap
                    >
                      {notification.title}
                    </Typography>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={typeColorMap[notification.type] || 'primary'}
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(notification.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  {!notification.isRead && (
                    <Tooltip title="Mark as Read">
                      <IconButton size="small" color="primary" onClick={() => handleMarkRead(notification.id)}>
                        <MarkEmailRead fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(notification)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={sendOpen}
        title="Send Notification"
        onClose={() => { setSendOpen(false); reset(); }}
        onSubmit={handleSubmit(handleSendSubmit)}
        submitText="Send"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="title" control={control as Control<any>} label="Title" required />
          <FormTextField
            name="message"
            control={control as Control<any>}
            label="Message"
            multiline
            rows={3}
            required
          />
          <FormSelect
            name="type"
            control={control as Control<any>}
            label="Notification Type"
            options={notificationTypeOptions}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Notification"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteDialogOpen(false); setDeleteTarget(null); }}
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
