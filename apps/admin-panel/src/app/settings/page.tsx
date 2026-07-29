'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Save, Settings as SettingsIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import FormSwitch from '@/components/forms/FormSwitch';
import { settingsSchema, SettingsFormData } from '@/utils/validations';
import { Control } from 'react-hook-form';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
  { value: 'IST', label: 'IST (Indian Standard Time)' },
  { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
];

const sessionTimeoutOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '1440', label: '24 hours' },
];

const passwordPolicyOptions = [
  { value: 'weak', label: 'Weak' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' },
];

const notificationFrequencyOptions = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
];

const themeModeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const sidebarStyleOptions = [
  { value: 'full', label: 'Full' },
  { value: 'compact', label: 'Compact' },
  { value: 'mini', label: 'Mini' },
];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const primaryColors = [
  { name: 'Blue', color: '#1976D2' },
  { name: 'Purple', color: '#7B1FA2' },
  { name: 'Teal', color: '#00897B' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  // General settings
  const generalForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'ServiceHub',
      contactEmail: 'admin@servicehub.com',
      contactPhone: '1234567890',
    },
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    frequency: 'realtime',
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'medium',
    ipWhitelist: '',
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    themeMode: 'light',
    primaryColor: '#1976D2',
    sidebarStyle: 'full',
    fontSize: 'medium',
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        subtitle="Configure platform settings"
        action={
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={saving}
          >
            Save Changes
          </Button>
        }
      />

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
          <Tab label="Notifications" />
          <Tab label="Security" />
          <Tab label="Appearance" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* General Tab */}
          <TabPanel value={activeTab} index={0}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                General Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure basic platform information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormTextField
                  name="siteName"
                  control={generalForm.control as Control<any>}
                  label="Site Name"
                  required
                />
                <FormTextField
                  name="contactEmail"
                  control={generalForm.control as Control<any>}
                  label="Contact Email"
                  type="email"
                  required
                />
                <FormTextField
                  name="contactPhone"
                  control={generalForm.control as Control<any>}
                  label="Contact Phone"
                  required
                />
                <FormTextField
                  name="siteDescription"
                  control={generalForm.control as Control<any>}
                  label="Site Description"
                  multiline
                  rows={3}
                  placeholder="Describe your platform..."
                />
                <FormTextField
                  name="address"
                  control={generalForm.control as Control<any>}
                  label="Address"
                  multiline
                  rows={2}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormSelect
                    name="currency"
                    control={generalForm.control as Control<any>}
                    label="Currency"
                    options={currencyOptions}
                  />
                  <FormSelect
                    name="timezone"
                    control={generalForm.control as Control<any>}
                    label="Timezone"
                    options={timezoneOptions}
                  />
                </Box>
                <FormSwitch
                  name="maintenanceMode"
                  control={generalForm.control as Control<any>}
                  label="Maintenance Mode"
                  description="Enable maintenance mode to prevent user access"
                />
              </Box>
            </Paper>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={1}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage how notifications are sent to admins
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifSettings.emailNotifications}
                        onChange={(e) =>
                          setNotifSettings((s) => ({ ...s, emailNotifications: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <span>
                        Email Notifications
                        <Typography component="span" variant="caption" color="text.secondary" display="block">
                          Receive notifications via email
                        </Typography>
                      </span>
                    }
                  />
                </FormGroup>
                <Divider />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifSettings.pushNotifications}
                        onChange={(e) =>
                          setNotifSettings((s) => ({ ...s, pushNotifications: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <span>
                        Push Notifications
                        <Typography component="span" variant="caption" color="text.secondary" display="block">
                          Receive push notifications in browser
                        </Typography>
                      </span>
                    }
                  />
                </FormGroup>
                <Divider />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifSettings.smsNotifications}
                        onChange={(e) =>
                          setNotifSettings((s) => ({ ...s, smsNotifications: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <span>
                        SMS Notifications
                        <Typography component="span" variant="caption" color="text.secondary" display="block">
                          Receive critical alerts via SMS
                        </Typography>
                      </span>
                    }
                  />
                </FormGroup>
                <Divider sx={{ my: 1 }} />
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Notification Frequency</InputLabel>
                  <Select
                    value={notifSettings.frequency}
                    label="Notification Frequency"
                    onChange={(e) =>
                      setNotifSettings((s) => ({ ...s, frequency: e.target.value }))
                    }
                  >
                    {notificationFrequencyOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={2}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure platform security policies
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) =>
                          setSecuritySettings((s) => ({ ...s, twoFactorAuth: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <span>
                        Two-Factor Authentication
                        <Typography component="span" variant="caption" color="text.secondary" display="block">
                          Require 2FA for all admin accounts
                        </Typography>
                      </span>
                    }
                  />
                </FormGroup>
                <Divider />
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Session Timeout</InputLabel>
                  <Select
                    value={securitySettings.sessionTimeout}
                    label="Session Timeout"
                    onChange={(e) =>
                      setSecuritySettings((s) => ({ ...s, sessionTimeout: e.target.value }))
                    }
                  >
                    {sessionTimeoutOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Password Policy</InputLabel>
                  <Select
                    value={securitySettings.passwordPolicy}
                    label="Password Policy"
                    onChange={(e) =>
                      setSecuritySettings((s) => ({ ...s, passwordPolicy: e.target.value }))
                    }
                  >
                    {passwordPolicyOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="IP Whitelist"
                  multiline
                  rows={3}
                  placeholder="Enter allowed IP addresses, one per line"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) =>
                    setSecuritySettings((s) => ({ ...s, ipWhitelist: e.target.value }))
                  }
                  helperText="Leave empty to allow all IPs"
                />
              </Box>
            </Paper>
          </TabPanel>

          {/* Appearance Tab */}
          <TabPanel value={activeTab} index={3}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Appearance Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Customize the look and feel of the admin panel
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Theme Mode</InputLabel>
                  <Select
                    value={appearanceSettings.themeMode}
                    label="Theme Mode"
                    onChange={(e) =>
                      setAppearanceSettings((s) => ({ ...s, themeMode: e.target.value }))
                    }
                  >
                    {themeModeOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                    Primary Color
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {primaryColors.map((c) => (
                      <Box
                        key={c.color}
                        onClick={() => setAppearanceSettings((s) => ({ ...s, primaryColor: c.color }))}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: c.color,
                          cursor: 'pointer',
                          border: '3px solid',
                          borderColor:
                            appearanceSettings.primaryColor === c.color ? 'text.primary' : 'transparent',
                          transition: 'border-color 0.2s',
                          '&:hover': { opacity: 0.85 },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Selected: {primaryColors.find((c) => c.color === appearanceSettings.primaryColor)?.name || 'Custom'}
                  </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Sidebar Style</InputLabel>
                  <Select
                    value={appearanceSettings.sidebarStyle}
                    label="Sidebar Style"
                    onChange={(e) =>
                      setAppearanceSettings((s) => ({ ...s, sidebarStyle: e.target.value }))
                    }
                  >
                    {sidebarStyleOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={appearanceSettings.fontSize}
                    label="Font Size"
                    onChange={(e) =>
                      setAppearanceSettings((s) => ({ ...s, fontSize: e.target.value }))
                    }
                  >
                    {fontSizeOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </TabPanel>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
