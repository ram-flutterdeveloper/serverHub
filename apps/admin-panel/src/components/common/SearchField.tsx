'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { SearchOutlined, Clear } from '@mui/icons-material';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    // One debounced effect keeps the box in sync with a controlled `value` and
    // avoids notifying the parent on every keystroke.
    const timer = setTimeout(() => {
      setInternalValue(value);
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [internalValue, onChange, value]);

  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange('');
  }, [onChange]);

  return (
    <TextField
      size="small"
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      placeholder={placeholder}
      sx={{ minWidth: 300 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined color="action" />
            </InputAdornment>
          ),
          endAdornment: internalValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
