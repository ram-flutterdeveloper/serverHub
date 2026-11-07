// 'use client';

// import React, { useRef, useState } from 'react';
// import { Box, Button, Typography } from '@mui/material';
// import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';

// interface ImageUploadFieldProps {
//   file: File | null;
//   onChange: (file: File | null) => void;
//   previewUrl?: string | null;
//   label?: string;
//   helperText?: string;
// }

// const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
// const MAX_SIZE = 10 * 1024 * 1024; // multer limit on the backend

// export default function ImageUploadField({
//   file,
//   onChange,
//   previewUrl,
//   label = 'Image',
//   helperText,
// }: ImageUploadFieldProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [error, setError] = useState<string | null>(null);

//   const preview =
//     previewUrl ?? (file ? URL.createObjectURL(file) : null);

//   const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = event.target.files?.[0] ?? null;
//     setError(null);

//     if (selected && !ACCEPTED.includes(selected.type)) {
//       setError('Only JPG, PNG and WEBP images are accepted by the backend');
//       return;
//     }
//     if (selected && selected.size > MAX_SIZE) {
//       setError('Image must be 10 MB or smaller');
//       return;
//     }

//     onChange(selected);
//   };

//   return (
//     <Box>
//       <Typography variant="body2" fontWeight={500} gutterBottom>
//         {label}
//       </Typography>
//       <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//         {preview && (
//           <Box
//             component="img"
//             src={preview}
//             alt="preview"
//             sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
//           />
//         )}
//         <Button
//           size="small"
//           variant="outlined"
//           startIcon={<CloudUploadOutlined />}
//           onClick={() => inputRef.current?.click()}
//         >
//           {file ? 'Replace image' : 'Upload image'}
//         </Button>
//         {file && (
//           <Button size="small" color="error" onClick={() => onChange(null)}>
//             Remove
//           </Button>
//         )}
//       </Box>
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/jpeg,image/png,image/jpg,image/webp"
//         hidden
//         onChange={handleSelect}
//       />
//       <Typography variant="caption" color={error ? 'error' : 'text.secondary'} display="block" sx={{ mt: 0.5 }}>
//         {error ?? helperText ?? 'JPG, PNG or WEBP, max 10 MB. The backend converts uploads to WEBP.'}
//       </Typography>
//     </Box>
//   );
// }


'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';

interface ImageUploadFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  previewUrl?: string | null;
  label?: string;
  helperText?: string;
}

const ACCEPTED = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploadField({
  file,
  onChange,
  previewUrl,
  label = 'Image',
  helperText,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Create a preview for the newly selected file and clean it up.
  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // A newly selected file takes priority over the existing image.
  const preview = localPreview || previewUrl || null;

  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files?.[0] ?? null;

    if (!selected) return;

    setError(null);

    if (!ACCEPTED.includes(selected.type)) {
      setError('Only JPG, PNG and WEBP images are accepted.');
      event.target.value = '';
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError('Image must be 10 MB or smaller.');
      event.target.value = '';
      return;
    }

    onChange(selected);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} gutterBottom>
        {label}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {preview && (
          <Box
            component="img"
            src={preview}
            alt="Image preview"
            onError={() =>
              setError('Unable to load image. Check the image URL.')
            }
            sx={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}

        <Button
          size="small"
          variant="outlined"
          startIcon={<CloudUploadOutlined />}
          onClick={() => inputRef.current?.click()}
        >
          {file || preview ? 'Replace image' : 'Upload image'}
        </Button>

        {preview && (
          <Button
            size="small"
            color="error"
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleSelect}
      />

      <Typography
        variant="caption"
        color={error ? 'error' : 'text.secondary'}
        display="block"
        sx={{ mt: 0.5 }}
      >
        {error ??
          helperText ??
          'JPG, PNG or WEBP, max 10 MB.'}
      </Typography>
    </Box>
  );
}
