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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Block,
  Delete,
  VerifiedUser,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Login,
  History,
  BookOnline,
  AccountBalance,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyUsers } from '@/data/users';
import { User, UserRole, UserStatus } from '@/types';
import { userSchema, UserFormData } from '@/utils/validations';
import { formatDate, formatCurrency, formatRelativeTime, formatDateTime } from '@/utils';

const roleOptions = Object.values(UserRole).map((r) => ({
  value: r,
  label: r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const user = useMemo(() => users.find((u) => u.id === userId), [users, userId]);

  const { control, handleSubmit, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', role: '' },
  });

  const handleEdit = () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
      setEditDialogOpen(true);
    }
  };

  const handleFormSubmit = (data: UserFormData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data, role: data.role as UserRole } : u))
    );
    setEditDialogOpen(false);
    setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
  };

  const handleSuspend = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED }
          : u
      )
    );
    setSuspendDialogOpen(false);
    setSnackbar({ open: true, message: 'User status updated', severity: 'success' });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    router.push('/users');
  };

  if (!user) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          User not found
        </Typography>
      </AdminLayout>
    );
  }

  const isSuspended = user.status === UserStatus.SUSPENDED;

  const activityItems = [
    { icon: <Login />, text: 'Last login', value: formatDateTime(user.lastLoginAt) },
    { icon: <BookOnline />, text: 'Total bookings', value: user.totalBookings.toString() },
    { icon: <AccountBalance />, text: 'Total spent', value: formatCurrency(user.totalSpent) },
    { icon: <CalendarToday />, text: 'Member since', value: formatDate(user.createdAt) },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Users', path: '/users' },
          { label: `${user.firstName} ${user.lastName}` },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/users')}>
            Back to Users
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <UserAvatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  avatar={user.avatar}
                  size={80}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    {user.emailVerified && (
                      <Chip
                        icon={<VerifiedUser />}
                        label="Verified"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ID: {user.id}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <StatusChip status={user.role.replace(/_/g, ' ')} size="medium" />
                    <StatusChip status={user.status} size="medium" />
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{user.phone}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{user.city || 'Not specified'}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">Joined {formatDate(user.createdAt)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Statistics
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {user.totalBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {formatCurrency(user.totalSpent)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="info.main">
                      {formatDate(user.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Block />}
                  fullWidth
                  color={isSuspended ? 'success' : 'warning'}
                  onClick={() => setSuspendDialogOpen(true)}
                >
                  {isSuspended ? 'Activate User' : 'Suspend User'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  fullWidth
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete User
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Activity
              </Typography>
              <List disablePadding>
                {activityItems.map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      secondary={item.value}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last active {formatRelativeTime(user.lastLoginAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editDialogOpen}
        title="Edit User"
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormTextField name="firstName" control={control as Control<any>} label="First Name" required />
            <FormTextField name="lastName" control={control as Control<any>} label="Last Name" required />
          </Box>
          <FormTextField name="email" control={control as Control<any>} label="Email" type="email" required />
          <FormTextField name="phone" control={control as Control<any>} label="Phone" required />
          <FormSelect name="role" control={control as Control<any>} label="Role" options={roleOptions} required />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={suspendDialogOpen}
        title={isSuspended ? 'Activate User' : 'Suspend User'}
        message={isSuspended ? `Are you sure you want to activate ${user.firstName} ${user.lastName}?` : `Are you sure you want to suspend ${user.firstName} ${user.lastName}? They will not be able to access the platform.`}
        confirmText={isSuspended ? 'Activate' : 'Suspend'}
        onConfirm={handleSuspend}
        onCancel={() => setSuspendDialogOpen(false)}
        severity={isSuspended ? 'info' : 'warning'}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
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
