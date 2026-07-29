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
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  CalendarToday,
  PriorityHigh,
  AssignmentInd,
  ReportProblem,
  CheckCircle,
  Gavel,
  Send,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { dummySupportTickets } from '@/data/support';
import {
  SupportTicket,
  SupportTicketStatus,
  SupportTicketPriority,
} from '@/types';
import { formatDate } from '@/utils';

const assignees = ['Emily Brown', 'Robert Anderson', 'Christopher Jackson', 'Unassigned'];

const dummyMessages = [
  {
    id: 'msg_001',
    sender: 'Customer',
    senderName: '',
    content: '',
    createdAt: '',
    isCustomer: true,
  },
  {
    id: 'msg_002',
    sender: 'Support Agent',
    senderName: 'Emily Brown',
    content: "Thank you for reaching out. We've looked into this and will get back to you shortly.",
    createdAt: '2025-02-11T09:00:00Z',
    isCustomer: false,
  },
  {
    id: 'msg_003',
    sender: 'Customer',
    senderName: '',
    content: 'Thank you, looking forward to a resolution.',
    createdAt: '2025-02-11T10:30:00Z',
    isCustomer: true,
  },
  {
    id: 'msg_004',
    sender: 'Support Agent',
    senderName: 'Emily Brown',
    content: "We've escalated this to our payments team. You should see an update within 24-48 hours.",
    createdAt: '2025-02-12T08:00:00Z',
    isCustomer: false,
  },
];

const priorityConfig: Record<string, { color: 'info' | 'warning' | 'error'; fontWeight?: number }> = {
  low: { color: 'info' },
  medium: { color: 'warning' },
  high: { color: 'error' },
  urgent: { color: 'error', fontWeight: 700 },
};

export default function SupportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [tickets, setTickets] = useState<SupportTicket[]>(dummySupportTickets);
  const [assignee, setAssignee] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const ticket = useMemo(() => tickets.find((t) => t.id === ticketId), [tickets, ticketId]);

  React.useEffect(() => {
    if (ticket) setAssignee(ticket.assignedTo || '');
  }, [ticket]);

  const updateStatus = (newStatus: SupportTicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    setStatusDialogOpen(false);
    setSnackbar({ open: true, message: 'Status updated', severity: 'success' });
  };

  const handleEscalate = () => {
    setEscalateDialogOpen(false);
    setSnackbar({ open: true, message: 'Ticket escalated', severity: 'success' });
  };

  const handleClose = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: SupportTicketStatus.CLOSED } : t
      )
    );
    setCloseDialogOpen(false);
    setSnackbar({ open: true, message: 'Ticket closed', severity: 'success' });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    setAssignee(newAssignee);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedTo: newAssignee } : t))
    );
    setSnackbar({ open: true, message: 'Assignee updated', severity: 'success' });
  };

  if (!ticket) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Ticket not found
        </Typography>
      </AdminLayout>
    );
  }

  const messages = dummyMessages.map((msg, i) => ({
    ...msg,
    senderName: i === 0 ? ticket.customerName : msg.senderName,
    content: i === 0 ? ticket.description : msg.content,
    createdAt: i === 0 ? ticket.createdAt : msg.createdAt,
  }));

  const pCfg = priorityConfig[ticket.priority] || { color: 'default' as const };

  return (
    <AdminLayout>
      <PageHeader
        title={`Ticket ${ticket.ticketNumber}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Support', path: '/support' },
          { label: ticket.ticketNumber },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/support')}>
            Back to Support
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.ticketNumber} &middot; Created {formatDate(ticket.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <StatusChip status={ticket.status.replace(/_/g, ' ')} size="medium" />
                  <Chip
                    label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    color={pCfg.color}
                    size="small"
                    sx={{ fontWeight: pCfg.fontWeight || 500, textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {ticket.description}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Message Thread
              </Typography>
              <List disablePadding>
                {messages.map((msg, index) => (
                  <React.Fragment key={msg.id}>
                    <ListItem
                      sx={{
                        alignItems: 'flex-start',
                        bgcolor: msg.isCustomer ? 'grey.50' : 'primary.50',
                        borderRadius: 1.5,
                        mb: 1,
                        py: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, mt: 0.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: msg.isCustomer ? 'grey.400' : 'primary.main',
                            fontSize: 14,
                          }}
                        >
                          {msg.isCustomer
                            ? ticket.customerName.charAt(0)
                            : msg.senderName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {msg.isCustomer ? ticket.customerName : msg.senderName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(msg.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {msg.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < messages.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Customer Info
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer"
                    secondary={ticket.customerName}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer ID"
                    secondary={ticket.customerId}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CalendarToday fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(ticket.createdAt)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Assignment
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={assignee}
                  label="Assigned To"
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                >
                  {assignees.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Actions
              </Typography>
              <Stack spacing={1.5}>
                {ticket.status !== SupportTicketStatus.RESOLVED &&
                  ticket.status !== SupportTicketStatus.CLOSED && (
                    <>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<Gavel />}
                        fullWidth
                        onClick={() => setStatusDialogOpen(true)}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ReportProblem />}
                        fullWidth
                        onClick={() => setEscalateDialogOpen(true)}
                      >
                        Escalate
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CheckCircle />}
                        fullWidth
                        onClick={() => setCloseDialogOpen(true)}
                      >
                        Close Ticket
                      </Button>
                    </>
                  )}
                {ticket.status === SupportTicketStatus.CLOSED && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AssignmentInd />}
                    fullWidth
                    onClick={() => updateStatus(SupportTicketStatus.OPEN)}
                  >
                    Reopen Ticket
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={statusDialogOpen}
        title="Update Status"
        message="Change ticket status to In Progress?"
        confirmText="Update"
        onConfirm={() => updateStatus(SupportTicketStatus.IN_PROGRESS)}
        onCancel={() => setStatusDialogOpen(false)}
        severity="info"
      />

      <ConfirmDialog
        open={escalateDialogOpen}
        title="Escalate Ticket"
        message="Are you sure you want to escalate this ticket? It will be flagged for priority review."
        confirmText="Escalate"
        onConfirm={handleEscalate}
        onCancel={() => setEscalateDialogOpen(false)}
        severity="error"
      />

      <ConfirmDialog
        open={closeDialogOpen}
        title="Close Ticket"
        message="Are you sure you want to close this ticket? This action cannot be undone."
        confirmText="Close"
        onConfirm={handleClose}
        onCancel={() => setCloseDialogOpen(false)}
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
