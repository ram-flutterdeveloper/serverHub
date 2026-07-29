'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Delete,
  Visibility,
  People,
  Block,
  HowToReg,
  PersonOutline,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyUsers } from '@/data/users';
import { User, UserRole, UserStatus } from '@/types';
import { userSchema, UserFormData } from '@/utils/validations';
import { formatDate, formatCurrency } from '@/utils';

const roleOptions = Object.values(UserRole).map((r) => ({
  value: r,
  label: r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const statusOptions = Object.values(UserStatus).map((s) => ({
  value: s,
  label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', role: '' },
  });

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.city.toLowerCase().includes(q)
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const now = dayjs();
    return {
      total: users.length,
      active: users.filter((u) => u.status === UserStatus.ACTIVE).length,
      suspended: users.filter((u) => u.status === UserStatus.SUSPENDED).length,
      newThisMonth: users.filter((u) => dayjs(u.createdAt).isSame(now, 'month')).length,
    };
  }, [users]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    reset({ firstName: '', lastName: '', email: '', phone: '', role: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, ...data, role: data.role as UserRole }
            : u
        )
      );
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        avatar: '',
        role: data.role as UserRole,
        status: UserStatus.ACTIVE,
        emailVerified: false,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        city: '',
        totalBookings: 0,
        totalSpent: 0,
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setDialogOpen(false);
    setSnackbar({ open: true, message: 'User saved successfully', severity: 'success' });
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UserAvatar firstName={row.firstName} lastName={row.lastName} avatar={row.avatar} size={36} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 140 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip status={row.role.replace(/_/g, ' ')} />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: ({ row }) => <StatusChip status={row.status} />,
    },
    { field: 'city', headerName: 'City', flex: 0.8, minWidth: 110 },
    {
      field: 'totalBookings',
      headerName: 'Bookings',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
    },
    {
      field: 'totalSpent',
      headerName: 'Spent',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => formatCurrency(row.totalSpent),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => router.push(`/users/${row.id}`)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        subtitle="Manage all platform users"
        action={
          <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenCreate}>
            Add User
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Users" value={stats.total} icon={<People />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active" value={stats.active} icon={<HowToReg />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Suspended" value={stats.suspended} icon={<Block />} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="New This Month" value={stats.newThisMonth} icon={<PersonOutline />} color="info" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        checkboxSelection
        onSearch={setSearch}
        searchPlaceholder="Search users by name, email, phone, city..."
        onRowClick={(row) => router.push(`/users/${row.id}`)}
        emptyMessage="No users found matching your search."
      />

      <FormDialog
        open={dialogOpen}
        title={selectedUser ? 'Edit User' : 'Add User'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={selectedUser ? 'Update' : 'Create'}
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
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
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
