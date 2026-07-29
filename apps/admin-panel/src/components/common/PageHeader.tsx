'use client';

import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Skeleton,
} from '@mui/material';
import NextLink from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function PageHeader({
  title,
  subtitle,
  description,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  const displaySubtitle = subtitle || description;
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast || !crumb.path) {
              return (
                <Typography key={index} variant="body2" color="text.primary">
                  {crumb.label}
                </Typography>
              );
            }
            return (
              <Link
                key={index}
                component={NextLink}
                href={crumb.path}
                variant="body2"
                color="inherit"
                underline="hover"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          {displaySubtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {displaySubtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}

export function PageHeaderSkeleton() {
  return (
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} />
        </Box>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  );
}
