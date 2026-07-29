'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { DialogProvider } from '@/context/DialogContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
