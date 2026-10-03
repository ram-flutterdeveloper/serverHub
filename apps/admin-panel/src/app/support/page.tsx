'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Refresh, SupportAgent } from '@mui/icons-material';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormInput from '@/components/common/FormInput';
import { supportService, SUPPORT_MISSING_ENDPOINTS } from '@/services/support.service';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  SOCKET_EVENTS,
  connectSocket,
  disconnectSocket,
  emitTypingStart,
  emitTypingStop,
  joinConversation,
  leaveConversation,
} from '@/lib/socket-client';
import { formatDateTime } from '@/utils';
import type { SupportConversation } from '@/types/api';

export default function SupportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * `GET /api/v1/support/conversations` is documented in Postman but not mounted
   * on the backend, so the panel resolves the signed-in user's conversation
   * through the only mounted route: `POST /api/v1/support/conversations`.
   */
  const conversations = useApiData<SupportConversation[]>(
    (signal) => supportService.list(signal),
    [],
  );

  const handleConversation = useCallback((data: SupportConversation | null) => {
    setConversation(data);
    if (!data) return;
    joinConversation(data.id);
    setJoined(true);
  }, []);

  useEffect(() => {
    let active = true;

    supportService
      .create({ subject: subject.trim() || undefined })
      .then((data) => {
        if (active) handleConversation(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        showToast(
          err instanceof Error ? err.message : 'Unable to open a support conversation',
          'error',
        );
      });

    return () => {
      active = false;
    };
    // Only re-run when the page is opened; the subject is used for the first call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleConversation]);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    const handleConnected = () => setConnected(true);
    const handleDisconnected = () => {
      setConnected(false);
      setJoined(false);
    };
    const handleJoined = () => setJoined(true);
    const handleTypingStart = (payload: { userId: string }) => {
      if (payload?.userId === user?.id) return;
      setTypingUserId(payload?.userId ?? 'unknown');
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingUserId(null), 4000);
    };
    const handleTypingStop = () => setTypingUserId(null);

    socket.on('connect', handleConnected);
    socket.on('disconnect', handleDisconnected);
    socket.on(SOCKET_EVENTS.JOINED, handleJoined);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

    return () => {
      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
      socket.off(SOCKET_EVENTS.JOINED, handleJoined);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      if (conversation) leaveConversation(conversation.id);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      disconnectSocket();
    };
  }, [conversation, user?.id]);

  const handleRefresh = () => {
    setCreating(true);
    supportService
      .create({ subject: subject.trim() || undefined })
      .then(handleConversation)
      .catch((err: unknown) =>
        showToast(err instanceof Error ? err.message : 'Unable to load conversation', 'error'),
      )
      .finally(() => setCreating(false));
  };

  const handleTyping = () => {
    if (!conversation) return;
    emitTypingStart(conversation.id);
    emitTypingStop(conversation.id);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Support"
        subtitle="Live support channel status"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Support' }]}
        action={
          <Button startIcon={<Refresh />} onClick={handleRefresh} disabled={creating}>
            Reconnect
          </Button>
        }
      />

      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Backend API required but unavailable
        </Typography>
        <Typography variant="body2" component="div">
          The backend currently mounts only <code>POST /api/v1/support/conversations</code> and the
          join/typing socket events. Inbox listing, message history, replies, assignment and status
          transitions are not implemented, so no conversation list or chat history can be shown
          here.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {SUPPORT_MISSING_ENDPOINTS.map((endpoint) => (
            <Chip key={endpoint} size="small" label={endpoint} variant="outlined" />
          ))}
        </Stack>
      </Alert>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardHeader
            title="Conversation"
            subheader="Created for your signed-in account"
            action={<SupportAgent color="action" />}
          />
          <Divider />
          <CardContent>
            {creating && !conversation && <Skeleton variant="text" />}

            {conversations.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {conversations.error}
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Expected: the conversations list endpoint is not mounted on the backend.
                </Typography>
              </Alert>
            )}

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Realtime channel
                </Typography>
                <Chip
                  size="small"
                  label={connected ? 'Socket connected' : 'Socket offline'}
                  color={connected ? 'success' : 'default'}
                />
                {joined && (
                  <Chip size="small" label="Room joined" color="primary" variant="outlined" />
                )}
              </Stack>

              {typingUserId && (
                <Alert severity="info">
                  Another participant is typing
                  <Typography variant="caption" display="block">
                    user {String(typingUserId).slice(0, 8)}… (Socket.IO `support:typing:*`)
                  </Typography>
                </Alert>
              )}

              {conversation ? (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {conversation.subject ?? 'Support conversation'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <StatusChip status={conversation.status} />
                    {conversation.bookingId && (
                      <Chip size="small" variant="outlined" label="Linked to a booking" />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Created {formatDateTime(conversation.createdAt)}
                    {conversation.lastMessageAt &&
                      ` • last activity ${formatDateTime(conversation.lastMessageAt)}`}
                  </Typography>
                </Box>
              ) : (
                !creating && (
                  <Typography variant="body2" color="text.secondary">
                    No conversation could be loaded.
                  </Typography>
                )
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardHeader title="Session" />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              <FormInput
                label="Conversation subject"
                value={subject}
                onChange={setSubject}
                placeholder="Billing question for booking #1234"
                helperText="Used when the conversation is created for your account"
              />

              <Button
                variant="outlined"
                onClick={handleTyping}
                disabled={!conversation || !connected}
              >
                Emit typing signal
              </Button>

              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Available socket events
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {Object.values(SOCKET_EVENTS).map((event) => (
                    <Chip key={event} size="small" label={event} variant="outlined" />
                  ))}
                </Stack>
              </Box>

              <Alert severity="info">
                Messages cannot be sent or read yet: the backend has no message endpoint and emits no
                message event. Add the endpoints listed above to activate the chat surface.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AdminLayout>
  );
}