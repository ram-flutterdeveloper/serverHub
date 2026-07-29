'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControlLabel, Switch, Typography } from '@mui/material';

interface FormSwitchProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  description?: string;
  disabled?: boolean;
}

export default function FormSwitch({
  name,
  control,
  label,
  description,
  disabled = false,
}: FormSwitchProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              {...field}
              checked={field.value || false}
              disabled={disabled}
            />
          }
          label={
            <span>
              {label}
              {description && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {description}
                </Typography>
              )}
            </span>
          }
        />
      )}
    />
  );
}
