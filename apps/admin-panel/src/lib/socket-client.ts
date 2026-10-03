'use client';

import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/config';
import { tokenStorage } from './token-storage';

/**
 * Socket events implemented by `modules/support/sockets/support.socket.ts`.
 *
 * The backend emits only `support:joined`, `support:typing:start` and
 * `support:typing:stop`; it accepts `support:join` and `support:leave`.
 * There is no message or read-receipt event yet, so the chat surface in the
 * support module reports that gap instead of faking traffic.
 */
export const SOCKET_EVENTS = {
  JOIN: 'support:join',
  JOINED: 'support:joined',
  LEAVE: 'support:leave',
  TYPING_START: 'support:typing:start',
  TYPING_STOP: 'support:typing:stop',
  CONNECT_ERROR: 'connect_error',
} as const;

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

/** Connects (once) using the stored access token. Returns null when logged out. */
export function connectSocket(): Socket | null {
  if (typeof window === 'undefined') return null;

  const token = tokenStorage.getAccessToken();
  if (!token) return null;

  if (socket?.connected) return socket;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) socket.connect();

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
}

export function joinConversation(conversationId: string): void {
  connectSocket()?.emit(SOCKET_EVENTS.JOIN, conversationId);
}

export function leaveConversation(conversationId: string): void {
  socket?.emit(SOCKET_EVENTS.LEAVE, conversationId);
}

export function emitTypingStart(conversationId: string): void {
  socket?.emit(SOCKET_EVENTS.TYPING_START, conversationId);
}

export function emitTypingStop(conversationId: string): void {
  socket?.emit(SOCKET_EVENTS.TYPING_STOP, conversationId);
}