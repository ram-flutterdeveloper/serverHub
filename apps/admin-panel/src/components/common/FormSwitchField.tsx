'use client';

import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

interface FormSwitchFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Checkbox-style switch for dialogs holding their own local state. */
export default function FormSwitchField({
  label,
  description,
  checked,
  onChange,
  disabled,
}: FormSwitchFieldProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label={
        <span>
          <Typography variant="body2">{label}</Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" display="block">
              {description}
            </Typography>
          )}
        </span>
      }
    />
  );
}