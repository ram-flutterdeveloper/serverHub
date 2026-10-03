'use client';

import React from 'react';
import { Avatar, Box } from '@mui/material';
import ImageOutlined from '@mui/icons-material/ImageOutlined';

interface ImageCellProps {
  src?: string | null;
  alt: string;
  size?: number;
}

/** Renders a thumbnail for an upload path returned by the backend. */
export default function ImageCell({ src, alt, size = 40 }: ImageCellProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Avatar
        src={src ?? undefined}
        alt={alt}
        variant="rounded"
        sx={{ width: size, height: size, bgcolor: 'grey.100', color: 'grey.500' }}
      >
        <ImageOutlined fontSize="small" />
      </Avatar>
    </Box>
  );
}