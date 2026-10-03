'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { DialogProvider } from '@/context/DialogContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <SidebarProvider>
            <DialogProvider>{children}</DialogProvider>
          </SidebarProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}