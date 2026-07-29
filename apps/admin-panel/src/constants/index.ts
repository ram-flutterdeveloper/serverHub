import {
  BookingStatus,
  PaymentStatus,
  UserStatus,
} from "@/types";

export const BREADCRUMB_HOME = { label: "Home", path: "/dashboard" } as const;

export const BOOKING_STATUS_COLORS: Record<BookingStatus, { bg: string; text: string }> = {
  [BookingStatus.PENDING]: { bg: "#FFF3E0", text: "#E65100" },
  [BookingStatus.CONFIRMED]: { bg: "#E3F2FD", text: "#1565C0" },
  [BookingStatus.IN_PROGRESS]: { bg: "#F3E5F5", text: "#7B1FA2" },
  [BookingStatus.COMPLETED]: { bg: "#E8F5E9", text: "#2E7D32" },
  [BookingStatus.CANCELLED]: { bg: "#FFEBEE", text: "#C62828" },
  [BookingStatus.REFUNDED]: { bg: "#FFF8E1", text: "#F57F17" },
  [BookingStatus.DISPUTED]: { bg: "#FCE4EC", text: "#AD1457" },
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { bg: string; text: string }> = {
  [PaymentStatus.PENDING]: { bg: "#FFF3E0", text: "#E65100" },
  [PaymentStatus.PAID]: { bg: "#E8F5E9", text: "#2E7D32" },
  [PaymentStatus.PARTIAL]: { bg: "#FFF8E1", text: "#F57F17" },
  [PaymentStatus.REFUNDED]: { bg: "#E3F2FD", text: "#1565C0" },
  [PaymentStatus.FAILED]: { bg: "#FFEBEE", text: "#C62828" },
};

export const USER_STATUS_COLORS: Record<UserStatus, { bg: string; text: string }> = {
  [UserStatus.ACTIVE]: { bg: "#E8F5E9", text: "#2E7D32" },
  [UserStatus.INACTIVE]: { bg: "#F5F5F5", text: "#616161" },
  [UserStatus.SUSPENDED]: { bg: "#FFEBEE", text: "#C62828" },
  [UserStatus.PENDING]: { bg: "#FFF3E0", text: "#E65100" },
};

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "Dashboard", path: "/dashboard" },
  {
    label: "Users",
    icon: "People",
    path: "/users",
  },
  {
    label: "Providers",
    icon: "Business",
    path: "/providers",
  },
  {
    label: "Bookings",
    icon: "CalendarMonth",
    path: "/bookings",
    badge: 12,
  },
  {
    label: "Categories",
    icon: "Category",
    path: "/categories",
  },
  {
    label: "Services",
    icon: "DesignServices",
    path: "/services",
  },
  {
    label: "Sub Services",
    icon: "Layers",
    path: "/sub-services",
  },
  {
    label: "Packages",
    icon: "Inventory2",
    path: "/packages",
  },
  {
    label: "Cities",
    icon: "LocationCity",
    path: "/cities",
  },
  {
    label: "Areas",
    icon: "Place",
    path: "/areas",
  },
  {
    label: "Payments",
    icon: "Payment",
    path: "/payments",
  },
  {
    label: "Wallet",
    icon: "AccountBalanceWallet",
    path: "/wallet",
  },
  {
    label: "Transactions",
    icon: "ReceiptLong",
    path: "/transactions",
  },
  {
    label: "Coupons",
    icon: "LocalOffer",
    path: "/coupons",
  },
  {
    label: "Reviews",
    icon: "RateReview",
    path: "/reviews",
  },
  {
    label: "Notifications",
    icon: "Notifications",
    path: "/notifications",
    badge: 5,
  },
  {
    label: "Support",
    icon: "SupportAgent",
    path: "/support",
    badge: 3,
  },
  {
    label: "Reports",
    icon: "Assessment",
    path: "/reports",
  },
  {
    label: "Analytics",
    icon: "Analytics",
    path: "/analytics",
  },
  {
    label: "Marketing",
    icon: "Campaign",
    path: "/marketing",
  },
  {
    label: "Advertisements",
    icon: "Campaign",
    path: "/advertisements",
  },
  {
    label: "CMS",
    icon: "Article",
    path: "/cms",
  },
  {
    label: "Blogs",
    icon: "Blog",
    path: "/blogs",
  },
  {
    label: "AI Dashboard",
    icon: "AutoAwesome",
    path: "/ai-dashboard",
  },
  {
    label: "Settings",
    icon: "Settings",
    path: "/settings",
  },
  {
    label: "Roles & Permissions",
    icon: "AdminPanelSettings",
    path: "/roles",
  },
  {
    label: "Audit Logs",
    icon: "History",
    path: "/audit-logs",
  },
  {
    label: "Logout",
    icon: "Logout",
    path: "/logout",
  },
];
