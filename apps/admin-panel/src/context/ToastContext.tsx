'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
  showToast: (message: string, severity?: ToastSeverity) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = useCallback((message: string, severity: ToastSeverity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}