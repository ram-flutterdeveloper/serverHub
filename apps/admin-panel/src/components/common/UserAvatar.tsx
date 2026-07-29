'use client';

import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
  size?: number;
}

const avatarColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function UserAvatar({
  firstName,
  lastName,
  avatar,
  size = 40,
}: UserAvatarProps) {
  const bgColor = useMemo(() => {
    const fullName = `${firstName}${lastName}`;
    const index = hashName(fullName) % avatarColors.length;
    return avatarColors[index];
  }, [firstName, lastName]);

  const initials = useMemo(() => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  }, [firstName, lastName]);

  return (
    <Avatar
      src={avatar}
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        fontSize: size * 0.4,
        fontWeight: 600,
      }}
      alt={`${firstName} ${lastName}`}
    >
      {!avatar ? initials : undefined}
    </Avatar>
  );
}
