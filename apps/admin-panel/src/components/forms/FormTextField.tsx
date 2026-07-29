'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

interface FormTextFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export default function FormTextField({
  name,
  control,
  label,
  type,
  required = false,
  disabled = false,
  multiline = false,
  rows,
  placeholder,
  fullWidth = true,
  helperText,
}: FormTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required ? `${label} is required` : undefined,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          required={required}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          placeholder={placeholder}
          fullWidth={fullWidth}
          error={!!error}
          helperText={error?.message || helperText}
          variant="outlined"
          size="small"
        />
      )}
    />
  );
}
