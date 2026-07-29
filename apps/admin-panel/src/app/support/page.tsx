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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  SupportAgent,
  Assignment,
  HourglassBottom,
  CheckCircle,
  ReportProblem,
  Visibility,
  Close,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import DataTable from '@/components/tables/DataTable';
import { dummySupportTickets } from '@/data/support';
import {
  SupportTicket,
  SupportTicketStatus,
  SupportTicketPriority,
} from '@/types';
import { formatDate } from '@/utils';

const priorityConfig: Record<string, { color: 'info' | 'warning' | 'error'; fontWeight?: number }> = {
  low: { color: 'info' },
  medium: { color: 'warning' },
  high: { color: 'error' },
  urgent: { color: 'error', fontWeight: 700 },
};

const statusFilterOptions = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const priorityFilterOptions = ['All', 'Low', 'Medium', 'High', 'Urgent'];

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>(dummySupportTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === SupportTicketStatus.OPEN).length,
      inProgress: tickets.filter((t) => t.status === SupportTicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter((t) => t.status === SupportTicketStatus.RESOLVED).length,
      closed: tickets.filter((t) => t.status === SupportTicketStatus.CLOSED).length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    let result = tickets;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.assignedTo.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(
        (t) => t.status.toLowerCase().replace(/_/g, ' ') === statusFilter.toLowerCase()
      );
    }

    if (priorityFilter !== 'All') {
      result = result.filter(
        (t) => t.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    return result;
  }, [tickets, search, statusFilter, priorityFilter]);

  const handleCloseTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: SupportTicketStatus.CLOSED } : t
      )
    );
    setSnackbar({ open: true, message: 'Ticket closed', severity: 'success' });
  };

  const columns: GridColDef[] = [
    {
      field: 'ticketNumber',
      headerName: 'Ticket #',
      flex: 1.2,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={600}>
          {row.ticketNumber}
        </Typography>
      ),
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => {
        const cfg = priorityConfig[row.priority] || { color: 'default' as const };
        return (
          <Chip
            label={row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
            color={cfg.color}
            size="small"
            sx={{ fontWeight: cfg.fontWeight || 500, textTransform: 'capitalize' }}
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => (
        <StatusChip status={row.status.replace(/_/g, ' ')} />
      ),
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      flex: 1,
      minWidth: 140,
      renderCell: ({ row }) => (
        <Typography variant="body2" color={row.assignedTo ? 'text.primary' : 'text.secondary'}>
          {row.assignedTo || 'Unassigned'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => router.push(`/support/${row.id}`)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status !== SupportTicketStatus.CLOSED && row.status !== SupportTicketStatus.RESOLVED && (
            <Tooltip title="Close">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTicket(row.id);
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Support"
        subtitle="Manage support tickets"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard title="Total Tickets" value={stats.total} icon={<SupportAgent />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard title="Open" value={stats.open} icon={<Assignment />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard title="In Progress" value={stats.inProgress} icon={<HourglassBottom />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard title="Closed" value={stats.closed} icon={<ReportProblem />} color="error" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusFilterOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {priorityFilterOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable
        rows={filtered}
        columns={columns}
        onSearch={setSearch}
        searchPlaceholder="Search tickets by #, subject, customer..."
        onRowClick={(row) => router.push(`/support/${row.id}`)}
        emptyMessage="No tickets found matching your filters."
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
