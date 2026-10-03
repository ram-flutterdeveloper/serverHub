'use client';

import React from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import FormInput from '@/components/common/FormInput';

export interface RepeatableField {
  name: string;
  label: string;
  type?: 'text' | 'number';
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}

export type RepeatableRow = Record<string, string>;

interface RepeatableListFieldProps {
  label: string;
  description?: string;
  fields: RepeatableField[];
  value: RepeatableRow[];
  onChange: (rows: RepeatableRow[]) => void;
  addLabel?: string;
  emptyHint?: string;
}

/**
 * Editor for the repeatable collections of the package details payload
 * (images, included, excluded, how it works, benefits, faqs). Values are kept
 * as strings and converted before the request is sent.
 */
export default function RepeatableListField({
  label,
  description,
  fields,
  value,
  onChange,
  addLabel = 'Add row',
  emptyHint,
}: RepeatableListFieldProps) {
  const updateRow = (index: number, field: string, fieldValue: string) => {
    onChange(value.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: fieldValue } : row)));
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, rowIndex) => rowIndex !== index));
  };

  const addRow = () => {
    const next: RepeatableRow = {};
    fields.forEach((field) => {
      next[field.name] = field.type === 'number' ? '1' : '';
    });
    onChange([...value, next]);
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      {description && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}

      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {value.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            {emptyHint ?? 'No rows yet.'}
          </Typography>
        )}

        {value.map((row, index) => (
          <Box
            key={index}
            sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Stack spacing={1.5} sx={{ flex: 1 }}>
                {fields.map((field) => (
                  <FormInput
                    key={field.name}
                    label={field.label}
                    value={row[field.name] ?? ''}
                    onChange={(fieldValue) => updateRow(index, field.name, fieldValue)}
                    type={field.type}
                    multiline={field.multiline}
                    rows={field.rows}
                    placeholder={field.placeholder}
                  />
                ))}
              </Stack>
              <IconButton
                aria-label={`Remove ${label} row ${index + 1}`}
                color="error"
                size="small"
                onClick={() => removeRow(index)}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        ))}

        <Button size="small" startIcon={<AddCircleOutline />} onClick={addRow} sx={{ alignSelf: 'flex-start' }}>
          {addLabel}
        </Button>
      </Stack>
    </Box>
  );
}