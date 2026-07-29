'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Campaign,
  Email,
  Send,
  AdUnits,
  TouchApp,
  Sms,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import FormDialog from '@/components/dialogs/FormDialog';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { dummyCampaigns } from '@/data/campaigns';
import { Campaign as CampaignType, CampaignStatus } from '@/types';
import { formatDate } from '@/utils';

const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  content: z.string().min(1, 'Content is required'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const typeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push Notification' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-App' },
];

const typeIcons: Record<string, React.ReactElement> = {
  email: <Email fontSize="small" />,
  push: <Send fontSize="small" />,
  sms: <Sms fontSize="small" />,
  in_app: <TouchApp fontSize="small" />,
};

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>(dummyCampaigns);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { control, handleSubmit, reset } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: { name: '', type: '', content: '' },
  });

  const stats = useMemo(
    () => ({
      total: campaigns.length,
      active: campaigns.filter(
        (c) => c.status === CampaignStatus.RUNNING
      ).length,
      completed: campaigns.filter(
        (c) => c.status === CampaignStatus.COMPLETED
      ).length,
      totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    }),
    [campaigns]
  );

  const filtered = useMemo(() => {
    if (!search) return campaigns;
    const q = search.toLowerCase();
    return campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [campaigns, search]);

  const handleCreateCampaign = (data: CampaignFormData) => {
    const newCampaign: CampaignType = {
      id: `cmp_${Date.now()}`,
      name: data.name,
      type: data.type as CampaignType['type'],
      status: CampaignStatus.DRAFT,
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setDialogOpen(false);
    reset();
    setSnackbar({ open: true, message: 'Campaign created', severity: 'success' });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {typeIcons[row.type] || null}
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {row.type.replace(/_/g, ' ')}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => (
        <StatusChip status={row.status} />
      ),
    },
    {
      field: 'sent',
      headerName: 'Sent',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={500}>
          {row.sent.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'opened',
      headerName: 'Opened',
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        const pct = row.sent > 0 ? ((row.opened / row.sent) * 100).toFixed(1) : '0';
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">{row.opened.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">{pct}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={row.sent > 0 ? (row.opened / row.sent) * 100 : 0}
              color="info"
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'clicked',
      headerName: 'Clicked',
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        const pct = row.opened > 0 ? ((row.clicked / row.opened) * 100).toFixed(1) : '0';
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">{row.clicked.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">{pct}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={row.opened > 0 ? (row.clicked / row.opened) * 100 : 0}
              color="success"
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Marketing"
        subtitle="Manage marketing campaigns"
        action={
          <Button variant="contained" startIcon={<Campaign />} onClick={() => setDialogOpen(true)}>
            Create Campaign
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Campaigns" value={stats.total} icon={<Campaign />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active" value={stats.active} icon={<Send />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed" value={stats.completed} icon={<Campaign />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Sent" value={stats.totalSent.toLocaleString()} icon={<Email />} color="warning" />
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Campaigns" />
            <Tab label="Advertisements" />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <DataTable
              rows={filtered}
              columns={columns}
              onSearch={setSearch}
              searchPlaceholder="Search campaigns..."
              emptyMessage="No campaigns found."
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
              <CardContent>
                <AdUnits sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} color="text.secondary">
                  Advertisements Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Advertisements management coming soon. This section will allow you to create,
                  manage, and track ad campaigns across the platform.
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        title="Create Campaign"
        onClose={() => {
          setDialogOpen(false);
          reset();
        }}
        onSubmit={handleSubmit(handleCreateCampaign)}
        submitText="Create"
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormTextField name="name" control={control as Control<any>} label="Campaign Name" required />
          <FormSelect name="type" control={control as Control<any>} label="Type" options={typeOptions} required />
          <FormTextField
            name="content"
            control={control as Control<any>}
            label="Content"
            multiline
            rows={4}
            required
          />
        </Box>
      </FormDialog>

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
