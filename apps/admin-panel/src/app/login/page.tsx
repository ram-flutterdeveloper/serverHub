'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack, PhoneAndroid, Security, VerifiedUser } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/lib/api-client';

const mobileSchema = z.object({
  mobile: z
    .string()
    .trim()
    .min(10, 'Enter a 10 digit mobile number')
    .max(10, 'Enter a 10 digit mobile number')
    .regex(/^[0-9]{10}$/, 'Mobile number must contain digits only'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must contain digits only'),
});

type MobileForm = z.infer<typeof mobileSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { status, isAdmin, error, lastOtp, sendOtp, verifyOtp, clearError } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const devOtp = process.env.NODE_ENV === 'development' ? (lastOtp?.otp ?? null) : null;

  const mobileForm = useForm<MobileForm>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: '' },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      router.replace('/dashboard');
    }
  }, [status, isAdmin, router]);

  const handleSendOtp = mobileForm.handleSubmit(async ({ mobile: value }) => {
    setLoading(true);
    clearError();
    try {
      await sendOtp(value);
      setMobile(value);
      setStep('otp');
      showToast('OTP sent successfully', 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Unable to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  });

  const handleVerify = otpForm.handleSubmit(async ({ otp }) => {
    setLoading(true);
    clearError();
    try {
      await verifyOtp(mobile, otp);
      showToast('Login successful', 'success');
      router.replace('/dashboard');
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error ? err.message : 'Invalid OTP';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  });

  const handleBack = () => {
    setStep('mobile');
    otpForm.reset();
    clearError();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 50%, #1A237E 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 440,
          mx: 2,
          borderRadius: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Security sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={700}>
            ServiceHub
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {step === 'mobile' ? 'Sign in to Admin Panel' : 'Enter the OTP sent to your mobile'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 'mobile' ? (
          <Box
            component="form"
            onSubmit={handleSendOtp}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              label="Mobile Number"
              placeholder="6393100159"
              fullWidth
              size="small"
              autoComplete="tel"
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              {...mobileForm.register('mobile')}
              error={!!mobileForm.formState.errors.mobile}
              helperText={
                mobileForm.formState.errors.mobile?.message ??
                'The OTP is sent to this number.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{ py: 1.2, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleVerify}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            {devOtp && (
              <Alert severity="warning" icon={<VerifiedUser fontSize="inherit" />}>
                Development mode OTP: <strong>{devOtp}</strong>
              </Alert>
            )}

            <TextField
              label="OTP"
              placeholder="123456"
              fullWidth
              size="small"
              autoComplete="one-time-code"
              inputProps={{ inputMode: 'numeric', maxLength: 6 }}
              {...otpForm.register('otp')}
              error={!!otpForm.formState.errors.otp}
              helperText={
                otpForm.formState.errors.otp?.message ?? `Sent to +91 ${mobile}`
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{ py: 1.2, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>

            <Button
              type="button"
              variant="text"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={loading}
              sx={{ alignSelf: 'center' }}
            >
              Change mobile number
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            ServiceHub Admin v1.0
          </Typography>
        </Divider>

        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Protected admin access. Unauthorized attempts are logged.
        </Typography>
      </Paper>
    </Box>
  );
}