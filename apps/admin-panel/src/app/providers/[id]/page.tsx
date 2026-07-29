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
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Stack,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  CheckCircle,
  Cancel,
  Business,
  Person,
  Star,
  BookOnline,
  AccountBalance,
  LocationOn,
  CalendarToday,
  VerifiedUser,
  Gavel,
  Description,
  TrendingUp,
  Reviews,
  MonetizationOn,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import UserAvatar from '@/components/common/UserAvatar';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormTextField from '@/components/forms/FormTextField';
import { dummyProviders } from '@/data/providers';
import { Provider, ProviderStatus, KYCStatus } from '@/types';
import { providerSchema, ProviderFormData } from '@/utils/validations';
import { formatDate, formatCurrency, formatRelativeTime } from '@/utils';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
}

export default function ProviderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;

  const [providers, setProviders] = useState<Provider[]>(dummyProviders);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const provider = useMemo(
    () => providers.find((p) => p.id === providerId),
    [providers, providerId]
  );

  const { control, handleSubmit, reset } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: { businessName: '', businessType: '', description: '' },
  });

  const handleEdit = () => {
    if (provider) {
      reset({
        businessName: provider.businessName,
        businessType: provider.businessType,
        description: provider.description,
      });
      setEditDialogOpen(true);
    }
  };

  const handleFormSubmit = (data: ProviderFormData) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, ...data } : p))
    );
    setEditDialogOpen(false);
    setSnackbar({ open: true, message: 'Provider updated successfully', severity: 'success' });
  };

  const handleVerify = () => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, kycStatus: KYCStatus.VERIFIED } : p
      )
    );
    setVerifyDialogOpen(false);
    setSnackbar({ open: true, message: 'KYC verified successfully', severity: 'success' });
  };

  const handleRejectKYC = () => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, kycStatus: KYCStatus.REJECTED } : p
      )
    );
    setRejectDialogOpen(false);
    setSnackbar({ open: true, message: 'KYC rejected', severity: 'error' });
  };

  if (!provider) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Provider not found
        </Typography>
      </AdminLayout>
    );
  }

  const kycDocuments = [
    { name: 'ID Proof', status: provider.kycStatus === KYCStatus.VERIFIED ? 'verified' : 'pending' },
    { name: 'Business License', status: provider.kycStatus === KYCStatus.VERIFIED ? 'verified' : 'pending' },
    { name: 'Address Proof', status: provider.kycStatus === KYCStatus.VERIFIED ? 'verified' : 'pending' },
    { name: 'Insurance Certificate', status: provider.kycStatus === KYCStatus.VERIFIED ? 'verified' : 'pending' },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={provider.businessName}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Providers', path: '/providers' },
          { label: provider.businessName },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/providers')}>
            Back to Providers
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <UserAvatar
                  firstName={provider.user.firstName}
                  lastName={provider.user.lastName}
                  avatar={provider.logo}
                  size={80}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                      {provider.businessName}
                    </Typography>
                    {provider.isVerified && (
                      <Chip icon={<VerifiedUser />} label="Verified" size="small" color="success" variant="outlined" />
                    )}
                    {provider.isFeatured && (
                      <Chip label="Featured" size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {provider.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <StatusChip status={provider.status} size="medium" />
                    <StatusChip status={provider.kycStatus} size="medium" />
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2">
                          Owner: {provider.user.firstName} {provider.user.lastName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="body2">{provider.businessType}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{provider.city}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">Joined {formatDate(provider.joinDate)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {provider.categories.map((cat) => (
                      <Chip key={cat} label={cat} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab label="Overview" />
                <Tab label="KYC" />
                <Tab label="Performance" />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {provider.totalBookings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Bookings</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {formatCurrency(provider.totalEarnings)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        {provider.commissionRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Commission Rate</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                      Business Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {provider.description}
                    </Typography>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      KYC Verification
                    </Typography>
                    <StatusChip status={provider.kycStatus} size="medium" />
                  </Box>

                  {provider.kycStatus === KYCStatus.PENDING && (
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => setVerifyDialogOpen(true)}
                      >
                        Verify KYC
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </Box>

                <List>
                  {kycDocuments.map((doc) => (
                    <ListItem key={doc.name} sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText primary={doc.name} />
                      <Chip
                        label={doc.status}
                        size="small"
                        color={doc.status === 'verified' ? 'success' : 'warning'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star color="warning" />
                          <Typography variant="h6" fontWeight={600}>Rating</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h3" fontWeight={700}>
                            {provider.rating > 0 ? provider.rating.toFixed(1) : '—'}
                          </Typography>
                          {provider.rating > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              / 5.0 ({provider.totalReviews} reviews)
                            </Typography>
                          )}
                        </Box>
                        {provider.rating > 0 && (
                          <Rating value={provider.rating} precision={0.1} readOnly sx={{ mt: 1 }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <MonetizationOn color="success" />
                          <Typography variant="h6" fontWeight={600}>Revenue</Typography>
                        </Box>
                        <Typography variant="h3" fontWeight={700}>
                          {formatCurrency(provider.totalEarnings)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Avg. per booking: {provider.totalBookings > 0 ? formatCurrency(provider.totalEarnings / provider.totalBookings) : '—'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <TrendingUp color="primary" />
                          <Typography variant="h6" fontWeight={600}>Bookings</Typography>
                        </Box>
                        <Typography variant="h3" fontWeight={700}>
                          {provider.totalBookings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {provider.totalReviews} reviews received
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Reviews color="info" />
                          <Typography variant="h6" fontWeight={600}>Reviews</Typography>
                        </Box>
                        <Typography variant="h3" fontWeight={700}>
                          {provider.totalReviews}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">Satisfaction</Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {provider.rating > 0 ? `${Math.round((provider.rating / 5) * 100)}%` : '—'}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={provider.rating > 0 ? (provider.rating / 5) * 100 : 0}
                            color="success"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
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
                <Button variant="outlined" startIcon={<Edit />} fullWidth onClick={handleEdit}>
                  Edit Provider
                </Button>
                {provider.status !== ProviderStatus.APPROVED && (
                  <Button
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    fullWidth
                    color="success"
                    onClick={() => {
                      setProviders((prev) =>
                        prev.map((p) => (p.id === providerId ? { ...p, status: ProviderStatus.APPROVED } : p))
                      );
                      setSnackbar({ open: true, message: 'Provider approved', severity: 'success' });
                    }}
                  >
                    Approve
                  </Button>
                )}
                {provider.status !== ProviderStatus.SUSPENDED && (
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    fullWidth
                    color="warning"
                    onClick={() => {
                      setProviders((prev) =>
                        prev.map((p) => (p.id === providerId ? { ...p, status: ProviderStatus.SUSPENDED } : p))
                      );
                      setSnackbar({ open: true, message: 'Provider suspended', severity: 'success' });
                    }}
                  >
                    Suspend
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Owner Info
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <UserAvatar
                  firstName={provider.user.firstName}
                  lastName={provider.user.lastName}
                  avatar={provider.user.avatar}
                  size={48}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {provider.user.firstName} {provider.user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {provider.user.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><Person fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Phone" secondary={provider.user.phone} />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><LocationOn fontSize="small" /></ListItemIcon>
                  <ListItemText primary="City" secondary={provider.user.city} />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><CalendarToday fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Joined" secondary={formatDate(provider.user.createdAt)} />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><Gavel fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Last Active" secondary={formatRelativeTime(provider.user.lastLoginAt)} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FormDialog
        open={editDialogOpen}
        title="Edit Provider"
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitText="Update"
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="businessName" control={control as Control<any>} label="Business Name" required />
          <FormTextField name="businessType" control={control as Control<any>} label="Business Type" required />
          <FormTextField
            name="description"
            control={control as Control<any>}
            label="Description"
            multiline
            rows={3}
            required
          />
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={verifyDialogOpen}
        title="Verify KYC"
        message={`Are you sure you want to verify the KYC for ${provider.businessName}?`}
        confirmText="Verify"
        onConfirm={handleVerify}
        onCancel={() => setVerifyDialogOpen(false)}
        severity="info"
      />

      <ConfirmDialog
        open={rejectDialogOpen}
        title="Reject KYC"
        message={`Are you sure you want to reject the KYC for ${provider.businessName}?`}
        confirmText="Reject"
        onConfirm={handleRejectKYC}
        onCancel={() => setRejectDialogOpen(false)}
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
