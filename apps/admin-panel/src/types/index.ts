export type ID = string;
export type Timestamp = string;

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  SUPPORT_AGENT = "support_agent",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
}

export enum ProviderStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
  ACTIVE = "active",
}

export enum KYCStatus {
  NOT_SUBMITTED = "not_submitted",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  DISPUTED = "disputed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIAL = "partial",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export enum PaymentMethod {
  STRIPE = "stripe",
  RAZORPAY = "razorpay",
  WALLET = "wallet",
  CASH = "cash",
}

export enum ServiceStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export enum CouponType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export enum SupportTicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum SupportTicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum NotificationType {
  BOOKING = "booking",
  PAYMENT = "payment",
  SYSTEM = "system",
  PROMOTION = "promotion",
  REVIEW = "review",
  ALERT = "alert",
}

export enum DocumentType {
  ID_PROOF = "id_proof",
  ADDRESS_PROOF = "address_proof",
  BUSINESS_LICENSE = "business_license",
  INSURANCE = "insurance",
  CERTIFICATE = "certificate",
  OTHER = "other",
}

export enum DocumentStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  RUNNING = "running",
  COMPLETED = "completed",
  PAUSED = "paused",
}

export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: Timestamp;
  createdAt: Timestamp;
  city: string;
  totalBookings: number;
  totalSpent: number;
}

export interface Provider {
  id: ID;
  user: User;
  businessName: string;
  businessType: string;
  description: string;
  logo: string;
  coverImage: string;
  status: ProviderStatus;
  kycStatus: KYCStatus;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  totalEarnings: number;
  commissionRate: number;
  isVerified: boolean;
  isFeatured: boolean;
  categories: string[];
  city: string;
  joinDate: Timestamp;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
  serviceCount: number;
  subcategoryCount: number;
  createdAt: Timestamp;
}

export interface SubService {
  id: ID;
  name: string;
  slug: string;
  categoryId: ID;
  categoryName: string;
  description: string;
  isActive: boolean;
  serviceCount: number;
  createdAt: Timestamp;
}

export interface Service {
  id: ID;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryId: ID;
  subService: string;
  provider: string;
  providerId: ID;
  city: string;
  image: string;
  price: number;
  priceType: "fixed" | "hourly" | "starting_at";
  status: ServiceStatus;
  rating: number;
  totalBookings: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Timestamp;
}

export interface Package {
  id: ID;
  serviceId: ID;
  serviceName: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: number;
  isActive: boolean;
  bookings: number;
}

export interface City {
  id: ID;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
  providerCount: number;
  serviceCount: number;
}

export interface Area {
  id: ID;
  name: string;
  cityId: ID;
  cityName: string;
  isActive: boolean;
  providerCount: number;
}

export interface Booking {
  id: ID;
  bookingNumber: string;
  customerName: string;
  customerId: ID;
  customerAvatar: string;
  providerName: string;
  providerId: ID;
  service: string;
  serviceId: ID;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  scheduledDate: string;
  scheduledTime: string;
  amount: number;
  commission: number;
  netAmount: number;
  address: string;
  city: string;
  notes: string;
  createdAt: Timestamp;
}

export interface Payment {
  id: ID;
  transactionId: string;
  bookingId: ID;
  bookingNumber: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  refundAmount: number;
  createdAt: Timestamp;
}

export interface Wallet {
  id: ID;
  ownerName: string;
  ownerType: "user" | "provider";
  balance: number;
  currency: string;
  isActive: boolean;
}

export interface WalletTransaction {
  id: ID;
  walletId: ID;
  ownerName: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  description: string;
  status: "completed" | "pending" | "failed";
  createdAt: Timestamp;
}

export interface Review {
  id: ID;
  customerName: string;
  customerId: ID;
  providerName: string;
  providerId: ID;
  service: string;
  rating: number;
  comment: string;
  reply: string;
  isVisible: boolean;
  createdAt: Timestamp;
}

export interface Coupon {
  id: ID;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Timestamp;
}

export interface SupportTicket {
  id: ID;
  ticketNumber: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  customerName: string;
  customerId: ID;
  assignedTo: string;
  createdAt: Timestamp;
}

export interface CMSPage {
  id: ID;
  title: string;
  slug: string;
  excerpt: string;
  isPublished: boolean;
  updatedAt: Timestamp;
}

export interface Blog {
  id: ID;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  isPublished: boolean;
  views: number;
  createdAt: Timestamp;
}

export interface Role {
  id: ID;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
}

export interface AuditLog {
  id: ID;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  createdAt: Timestamp;
}

export interface Campaign {
  id: ID;
  name: string;
  type: "email" | "push" | "sms" | "in_app";
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicked: number;
  createdAt: Timestamp;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  bookingsGrowth: number;
  totalUsers: number;
  usersGrowth: number;
  totalProviders: number;
  providersGrowth: number;
  activeServices: number;
  totalCommission: number;
}
