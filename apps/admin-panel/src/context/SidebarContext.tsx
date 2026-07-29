'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  mobileOpen: boolean;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      isCollapsed,
      mobileOpen,
      toggleSidebar,
      toggleCollapsed,
      setMobileOpen,
      closeMobile,
      openSidebar,
      closeSidebar,
    }),
    [isOpen, isCollapsed, mobileOpen, toggleSidebar, toggleCollapsed, closeMobile, openSidebar, closeSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}
