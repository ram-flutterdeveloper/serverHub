'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Shield,
  GroupAdd,
} from '@mui/icons-material';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyRoles } from '@/data/roles';
import { Role } from '@/types';
import { roleSchema, RoleFormData } from '@/utils/validations';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(dummyRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(dummyRoles[0] ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, reset } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', description: '' },
  });

  const handleOpenCreate = () => {
    setEditingRole(null);
    reset({ name: '', description: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRole(role);
    reset({ name: role.name, description: role.description });
    setDialogOpen(true);
  };

  const handleOpenDelete = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingRole(role);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: RoleFormData) => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id ? { ...r, name: data.name, description: data.description } : r
        )
      );
      if (selectedRole?.id === editingRole.id) {
        setSelectedRole((prev) => prev ? { ...prev, name: data.name, description: data.description } : prev);
      }
      setSnackbar({ open: true, message: 'Role updated successfully', severity: 'success' });
    } else {
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: data.name,
        description: data.description,
        permissions: [],
        userCount: 0,
        isDefault: false,
      };
      setRoles((prev) => [...prev, newRole]);
      setSnackbar({ open: true, message: 'Role created successfully', severity: 'success' });
    }
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingRole) {
      setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
      if (selectedRole?.id === deletingRole.id) {
        setSelectedRole(roles[0] ?? null);
      }
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Role deleted successfully', severity: 'success' });
    }
  };

  const groupedPermissions = useMemo(() => {
    if (!selectedRole) return {};
    const groups: Record<string, string[]> = {};
    selectedRole.permissions.forEach((perm) => {
      const [module] = perm.split(':');
      const moduleKey = module.charAt(0).toUpperCase() + module.slice(1);
      if (!groups[moduleKey]) groups[moduleKey] = [];
      groups[moduleKey].push(perm);
    });
    return groups;
  }, [selectedRole]);

  return (
    <AdminLayout>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Manage admin roles and their permissions"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Role
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Left Column - Roles List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {roles.map((role) => (
              <Paper
                key={role.id}
                variant="outlined"
                onClick={() => setSelectedRole(role)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: selectedRole?.id === role.id ? 'primary.main' : 'divider',
                  bgcolor: selectedRole?.id === role.id ? 'primary.50' : 'background.paper',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield color={selectedRole?.id === role.id ? 'primary' : 'action'} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {role.name}
                    </Typography>
                    {role.isDefault && (
                      <Chip label="Default" size="small" color="info" variant="outlined" />
                    )}
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={(e) => handleOpenEdit(role, e)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={role.isDefault ? 'Cannot delete default role' : 'Delete'}>
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={role.isDefault}
                          onClick={(e) => handleOpenDelete(role, e)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.4 }}>
                  {role.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<GroupAdd sx={{ fontSize: 14 }} />}
                    label={`${role.userCount} users`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${role.permissions.length} permissions`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Right Column - Permissions */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedRole ? (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Permissions for {selectedRole.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRole.description}
                  </Typography>
                </Box>
                <Chip
                  label={`${selectedRole.permissions.length} permissions assigned`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {Object.keys(groupedPermissions).length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(groupedPermissions).map(([module, perms]) => (
                    <Paper key={module} variant="outlined" sx={{ p: 2.5 }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                        {module}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {perms.map((perm) => {
                          const action = perm.split(':')[1];
                          return (
                            <Chip
                              key={perm}
                              label={action}
                              size="small"
                              sx={{
                                fontWeight: 500,
                                bgcolor: 'grey.100',
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <Shield sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                  <Typography>No permissions assigned to this role</Typography>
                </Box>
              )}
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">Select a role to view permissions</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <FormDialog
        open={dialogOpen}
        title={editingRole ? 'Edit Role' : 'Add Role'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText={editingRole ? 'Update' : 'Create'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<any>} label="Role Name" required />
          <FormTextField name="description" control={control as Control<any>} label="Description" multiline rows={3} required />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Role"
        message={`Are you sure you want to delete the "${deletingRole?.name}" role? Users with this role will lose their permissions. This action cannot be undone.`}
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
