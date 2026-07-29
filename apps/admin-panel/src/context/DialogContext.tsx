'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type DialogType = 'create' | 'edit' | 'delete' | 'view' | 'confirm' | 'info' | 'warning' | 'success';

interface DialogState {
  isOpen: boolean;
  type: DialogType;
  title: string;
  data?: unknown;
  onConfirm?: () => void;
}

interface DialogContextType extends DialogState {
  openDialog: (options: Partial<Omit<DialogState, 'isOpen'>> & { type: DialogType; title: string }) => void;
  closeDialog: () => void;
}

const initialDialogState: DialogState = {
  isOpen: false,
  type: 'info',
  title: '',
  data: undefined,
  onConfirm: undefined,
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DialogState>(initialDialogState);

  const openDialog = useCallback(
    (options: Partial<Omit<DialogState, 'isOpen'>> & { type: DialogType; title: string }) => {
      setState({
        isOpen: true,
        type: options.type,
        title: options.title,
        data: options.data,
        onConfirm: options.onConfirm,
      });
    },
    []
  );

  const closeDialog = useCallback(() => {
    setState((prev) => ({
      ...initialDialogState,
      isOpen: false,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      openDialog,
      closeDialog,
    }),
    [state, openDialog, closeDialog]
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function useDialogContext(): DialogContextType {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
}

export type { DialogState, DialogType };
