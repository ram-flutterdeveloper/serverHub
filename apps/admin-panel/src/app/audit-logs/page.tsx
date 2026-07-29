'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  Assessment,
  Today,
  People,
  Category,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/tables/DataTable';
import { dummyAuditLogs } from '@/data/auditLogs';
import { AuditLog } from '@/types';
import { formatDateTime } from '@/utils';

const actionColors: Record<string, { color: 'success' | 'info' | 'error' | 'warning' | 'primary'; label: string }> = {
  create: { color: 'success', label: 'Created' },
  update: { color: 'info', label: 'Updated' },
  delete: { color: 'error', label: 'Deleted' },
  login: { color: 'primary', label: 'Login' },
  logout: { color: 'warning', label: 'Logout' },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const allModules = useMemo(() => {
    const set = new Set(dummyAuditLogs.map((l) => l.module));
    return Array.from(set).sort();
  }, []);

  const allActions = useMemo(() => {
    const set = new Set(dummyAuditLogs.map((l) => l.action));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = [...dummyAuditLogs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.ipAddress.includes(q) ||
          l.module.toLowerCase().includes(q)
      );
    }

    if (moduleFilter !== 'all') {
      result = result.filter((l) => l.module === moduleFilter);
    }

    if (actionFilter !== 'all') {
      result = result.filter((l) => l.action === actionFilter);
    }

    if (dateFrom) {
      result = result.filter((l) => dayjs(l.createdAt).isAfter(dayjs(dateFrom).startOf('day')));
    }

    if (dateTo) {
      result = result.filter((l) => dayjs(l.createdAt).isBefore(dayjs(dateTo).endOf('day')));
    }

    return result.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
  }, [search, moduleFilter, actionFilter, dateFrom, dateTo]);

  const paginated = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const stats = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const todayLogs = dummyAuditLogs.filter((l) => dayjs(l.createdAt).format('YYYY-MM-DD') === today);
    const uniqueUsers = new Set(dummyAuditLogs.map((l) => l.userName));
    const moduleCounts: Record<string, number> = {};
    dummyAuditLogs.forEach((l) => {
      moduleCounts[l.module] = (moduleCounts[l.module] || 0) + 1;
    });
    const mostActiveModule = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return {
      total: dummyAuditLogs.length,
      today: todayLogs.length,
      uniqueUsers: uniqueUsers.size,
      mostActiveModule,
    };
  }, []);

  const handleExportCSV = () => {
    setSnackbar({ open: true, message: 'Audit logs exported as CSV', severity: 'success' });
  };

  const handleExportPDF = () => {
    setSnackbar({ open: true, message: 'Audit logs exported as PDF', severity: 'success' });
  };

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Timestamp',
      flex: 1.2,
      minWidth: 170,
      renderCell: ({ row }) => (
        <Typography variant="body2">{formatDateTime(row.createdAt)}</Typography>
      ),
    },
    {
      field: 'userName',
      headerName: 'User',
      flex: 1,
      minWidth: 140,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={500}>
          {row.userName}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => {
        const config = actionColors[row.action] || { color: 'default' as const, label: row.action };
        return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 500 }} />;
      },
    },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 110 },
    {
      field: 'details',
      headerName: 'Details',
      flex: 2,
      minWidth: 250,
      renderCell: ({ row }) => (
        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.details}
        </Typography>
      ),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {row.ipAddress}
        </Typography>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activities"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExportCSV}>
              CSV
            </Button>
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPDF}>
              PDF
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Logs" value={stats.total} icon={<Assessment />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Today's Actions" value={stats.today} icon={<Today />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Unique Users" value={stats.uniqueUsers} icon={<People />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Most Active Module" value={stats.mostActiveModule} icon={<Category />} color="warning" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Module</InputLabel>
            <Select
              value={moduleFilter}
              label="Module"
              onChange={(e: SelectChangeEvent) => setModuleFilter(e.target.value)}
            >
              <MenuItem value="all">All Modules</MenuItem>
              {allModules.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={actionFilter}
              label="Action"
              onChange={(e: SelectChangeEvent) => setActionFilter(e.target.value)}
            >
              <MenuItem value="all">All Actions</MenuItem>
              {allActions.map((a) => (
                <MenuItem key={a} value={a}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="date"
            label="From"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
        </Box>
      </Paper>

      <DataTable
        rows={paginated}
        columns={columns}
        totalRows={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
        onSearch={(q) => { setSearch(q); setPage(0); }}
        searchPlaceholder="Search logs by user, details, IP..."
        emptyMessage="No audit logs found matching your filters."
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
