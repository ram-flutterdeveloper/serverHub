'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

interface FormSelectProps {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  label?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  fullWidth?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  size?: 'small' | 'medium';
  sx?: object;
  helperText?: string;
}

export default function FormSelect({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  multiple = false,
  fullWidth = true,
  value: valueProp,
  onChange: onChangeProp,
  size,
  sx,
  helperText,
}: FormSelectProps) {
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={multiple ? [] : ''}
        rules={{
          required: required ? `${label} is required` : undefined,
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl
            fullWidth={fullWidth}
            error={!!error}
            size={size ?? 'small'}
            required={required}
            disabled={disabled}
            sx={sx}
          >
            {label && <InputLabel>{label}</InputLabel>}
            <Select
              {...field}
              label={label}
              multiple={multiple}
            >
              {!multiple && (
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
              )}
              {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size ?? 'small'}
      disabled={disabled}
      sx={sx}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={valueProp ?? (multiple ? [] : '')}
        onChange={(e) => onChangeProp?.(e.target.value)}
        label={label}
        multiple={multiple}
      >
        {!multiple && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
