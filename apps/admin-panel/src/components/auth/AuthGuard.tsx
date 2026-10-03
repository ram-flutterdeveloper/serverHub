'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/context/AuthContext';

/**
 * Client-side route protection.
 *
 * Every page in the admin panel is wrapped in `AdminLayout`, so guarding here
 * covers the whole authenticated surface. The guard waits for the session to be
 * restored (access token -> `GET /profile`) and only trusts the role returned
 * by the backend.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      const timer = setTimeout(() => router.replace('/login'), 0);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status !== 'authenticated' || !isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {status === 'loading' ? 'Verifying your session…' : 'Redirecting to login…'}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}