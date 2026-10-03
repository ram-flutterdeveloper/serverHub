'use client';

import React from 'react';
import TextField from '@mui/material/TextField';

interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Labelled uncontrolled text input for dialogs that keep their own local state
 * (used by the master data modules, which post multipart bodies).
 */
export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  multiline,
  rows,
  helperText,
  fullWidth = true,
}: FormInputProps) {
  return (
    <TextField
      label={label}
      value={value}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      helperText={helperText}
      fullWidth={fullWidth}
      size="small"
      onChange={(event) => onChange(event.target.value)}
      slotProps={type === 'number' ? { htmlInput: { min: 0, step: 1 } } : undefined}
    />
  );
}