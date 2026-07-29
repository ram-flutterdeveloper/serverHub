'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CalendarMonth,
  People,
  Engineering,
  RateReview,
  Payment,
  Settings,
  Notifications,
  Logout,
  Inventory,
  Category,
  Campaign,
  CardGiftcard,
  LocalOffer,
  SupportAgent,
  Article,
  Shield,
  AccountBalanceWallet,
  Assessment,
  Map,
  Gavel,
  SmartToy,
  TrendingUp,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Bookings', path: '/bookings', icon: <CalendarMonth /> },
  { label: 'Users', path: '/users', icon: <People /> },
  { label: 'Providers', path: '/providers', icon: <Engineering /> },
  { label: 'Services', path: '/services', icon: <Inventory /> },
  { label: 'Categories', path: '/categories', icon: <Category /> },
  { label: 'Reviews', path: '/reviews', icon: <RateReview /> },
  { label: 'Payments', path: '/payments', icon: <Payment /> },
  { label: 'Wallet', path: '/wallet', icon: <AccountBalanceWallet /> },
  { label: 'Transactions', path: '/transactions', icon: <TrendingUp /> },
  { label: 'Packages', path: '/packages', icon: <CardGiftcard /> },
  { label: 'Coupons', path: '/coupons', icon: <LocalOffer /> },
  { label: 'Campaigns', path: '/marketing', icon: <Campaign /> },
  { label: 'Notifications', path: '/notifications', icon: <Notifications /> },
  { label: 'Support', path: '/support', icon: <SupportAgent /> },
  { divider: true },
  { label: 'CMS', path: '/cms', icon: <Article /> },
  { label: 'Blogs', path: '/blogs', icon: <Article /> },
  { label: 'Roles', path: '/roles', icon: <Shield /> },
  { label: 'Audit Logs', path: '/audit-logs', icon: <Gavel /> },
  { label: 'Reports', path: '/reports', icon: <Assessment /> },
  { label: 'Analytics', path: '/analytics', icon: <Assessment /> },
  { label: 'AI Dashboard', path: '/ai-dashboard', icon: <SmartToy /> },
  { divider: true },
  { label: 'Cities', path: '/cities', icon: <Map /> },
  { label: 'Areas', path: '/areas', icon: <Map /> },
  { label: 'Sub-Services', path: '/sub-services', icon: <Inventory /> },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 18, fontWeight: 700 }}>
          SH
        </Avatar>
        <Typography variant="h6" fontWeight={700} noWrap>
          ServiceHub
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflowY: 'auto', px: 1, py: 0.5 }}>
        {menuItems.map((item, index) => {
          if ('divider' in item && item.divider) {
            return <Divider key={`div-${index}`} sx={{ my: 1 }} />;
          }
          const menuItem = item as { label: string; path: string; icon: React.ReactElement };
          const isActive = pathname === menuItem.path || pathname?.startsWith(menuItem.path + '/');
          return (
            <ListItemButton
              key={menuItem.path}
              component={NextLink}
              href={menuItem.path}
              selected={isActive}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 1.5,
                mb: 0.25,
                px: 1.5,
                py: 0.75,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{menuItem.icon}</ListItemIcon>
              <ListItemText
                primary={menuItem.label}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <> <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Notifications">
            <IconButton color="inherit" component={NextLink} href="/notifications">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Account">
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>A</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          p: 3,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box></>
  );
}
