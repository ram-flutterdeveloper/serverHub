/**
 * Backend-aligned API types.
 *
 * These mirror the actual response payloads of the ServiceHub backend
 * (`apps/backend`) and the Postman collection. They intentionally live in a
 * separate module from `./index` so the legacy mock-only pages keep compiling.
 */

/* -------------------------------------------------------------------------- */
/*                                    Enums                                    */
/* -------------------------------------------------------------------------- */

export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
  DELETED: 'DELETED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ProviderStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ProviderStatus = (typeof ProviderStatus)[keyof typeof ProviderStatus];

export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROVIDER_ASSIGNED: 'PROVIDER_ASSIGNED',
  PROVIDER_ACCEPTED: 'PROVIDER_ACCEPTED',
  PROVIDER_REJECTED: 'PROVIDER_REJECTED',
  ON_THE_WAY: 'ON_THE_WAY',
  ARRIVED: 'ARRIVED',
  WORKING: 'WORKING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  COD: 'COD',
  ONLINE: 'ONLINE',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const RecordStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type RecordStatus = (typeof RecordStatus)[keyof typeof RecordStatus];

export const ReviewStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const KycStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];

export const SupportConversationStatus = {
  WAITING: 'WAITING',
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type SupportConversationStatus =
  (typeof SupportConversationStatus)[keyof typeof SupportConversationStatus];

export const SupportMessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE: 'FILE',
} as const;

export type SupportMessageType =
  (typeof SupportMessageType)[keyof typeof SupportMessageType];

export const SenderRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  PROVIDER: 'PROVIDER',
} as const;

export type SenderRole = (typeof SenderRole)[keyof typeof SenderRole];

export const DevicePlatform = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB',
} as const;

export type DevicePlatform = (typeof DevicePlatform)[keyof typeof DevicePlatform];

/* -------------------------------------------------------------------------- */
/*                              Envelope / pagination                          */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown> | null;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  [key: string]: string | number | undefined;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/*                                    Auth                                     */
/* -------------------------------------------------------------------------- */

export interface AuthUser {
  id: string;
  mobile: string;
  countryCode: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImage: string | null;
  gender: string | null;
  dob: string | null;
  isMobileVerified: boolean;
  isProfileCompleted: boolean;
  isEmailVerified: boolean;
  providerSignupStep?: number;
  status: string;
  role: string;
  googleId: string | null;
  authProvider: 'OTP' | 'GOOGLE';
  createdAt: string;
  updatedAt: string;
}

export interface SendOtpResult {
  expiresIn: number;
  /** Only returned by the backend when NODE_ENV === "development". */
  otp?: string;
}

export interface VerifyOtpResult {
  user: AuthUser;
  provider: AuthProvider | null;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Users                                     */
/* -------------------------------------------------------------------------- */

export type AdminUser = AuthUser;

export interface UsersDashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsers: number;
}

export interface UsersListResult {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/*                                  Providers                                  */
/* -------------------------------------------------------------------------- */

export interface ProviderSummaryUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  mobile: string;
  email: string | null;
  profileImage: string | null;
  status: string;
  createdAt: string;
}

export interface AdminProvider {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string | null;
  phone: string;
  experience: number;
  description: string | null;
  profileImage: string | null;
  isVerified: boolean;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
  user?: ProviderSummaryUser;
}

export interface ProvidersDashboardStats {
  totalProviders: number;
  approvedProviders: number;
  pendingProviders: number;
  suspendedProviders: number;
}

export interface ProvidersListResult {
  providers: AdminProvider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProviderLocation {
  id: string;
  providerId: string;
  cityId: string;
  areaId: string;
  googlePlaceId: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  latitude: number;
  longitude: number;
  pincode: string;
  serviceRadius: number;
  isPrimary: boolean;
}

export interface ProviderService {
  id: string;
  providerId: string;
  serviceId: string;
  isActive: boolean;
}

export interface ProviderDocument {
  id: string;
  providerId: string;
  documentType:
    | 'AADHAAR'
    | 'PAN'
    | 'GST'
    | 'SHOP_LICENSE'
    | 'DRIVING_LICENSE'
    | 'PASSPORT';
  documentNumber: string;
  frontImage: string;
  backImage: string | null;
  status: KycStatus;
  verifiedBy: string | null;
  verifiedAt: string | null;
  remarks: string | null;
}

export interface ProviderWorkingHour {
  id: string;
  providerId: string;
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface ProviderBankAccount {
  id: string;
  providerId: string;
  accountHolderName: string;
  bankName: string;
  branchName: string | null;
  accountNumber: string;
  ifscCode: string;
  upiId: string | null;
  accountType: 'SAVINGS' | 'CURRENT';
  isPrimary: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt: string | null;
  remarks: string | null;
}

/** Alias kept for call sites that render provider data on auth-related screens. */
export type AuthProvider = AdminProvider;

/* -------------------------------------------------------------------------- */
/*                                 Bookings                                    */
/* -------------------------------------------------------------------------- */

/** Snapshot of `UserAddress` returned as the booking `address` association. */
export interface BookingAddress {
  id: string;
  userId: string;
  cityId: string;
  areaId: string;
  houseNo: string;
  buildingName: string | null;
  floor: string | null;
  street: string | null;
  landmark: string | null;
  addressLine: string;
  latitude: number | null;
  longitude: number | null;
  contactPerson: string;
  contactNumber: string;
  addressType: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  status: RecordStatus;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  categoryId: string;
  subCategoryId: string | null;
  serviceId: string;
  packageId: string;
  packageName: string;
  packageDescription: string | null;
  duration: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  package?: PackageRecord | null;
}

export interface BookingRequirement {
  id: string;
  bookingId: string;
  requirementId: string;
  requirementTitle: string;
  value: string;
  extraPrice: number;
}

export interface BookingStatusLog {
  id: string;
  bookingId: string;
  status: BookingStatus;
  remarks: string | null;
  updatedBy: string | null;
  updatedByRole: string | null;
  createdAt: string;
}

export interface BookingCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  mobile: string;
  email: string | null;
  profileImage: string | null;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  providerId: string | null;
  packageId: string;
  addressId: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  tax: number;
  extraCharge: number;
  totalAmount: number;
  notes: string | null;
  cancelledReason: string | null;
  cancelledAt: string | null;
  assignmentExpiresAt: string | null;
  assignedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  assignedBy: string | null;
  rejectionReason: string | null;
  arrivalOtp: string | null;
  arrivalOtpVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: BookingCustomer | null;
  provider?: AdminProvider | null;
  items?: BookingItem[];
  address?: BookingAddress | null;
  requirements?: BookingRequirement[];
  statusLogs?: BookingStatusLog[];
}

export interface BookingsDashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  assignedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayBookings: number;
}

export interface BookingsListResult {
  bookings: Booking[];
  pagination: PaginationMeta;
}

/**
 * Provider returned by `GET /admin/bookings/:bookingId/providers`. The backend
 * enriches the provider row with its primary location, services, working hours
 * and the computed distance (km) from the booking address.
 */
export interface AvailableProvider extends AdminProvider {
  distance: number;
  locations: ProviderLocation[];
  providerServices: ProviderService[];
  workingHours: ProviderWorkingHour[];
}

export interface AssignProviderPayload {
  providerId: string;
}

export interface AssignProviderResult {
  success: boolean;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                               Master data                                   */
/* -------------------------------------------------------------------------- */

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  isFeatured: boolean;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  serviceId: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  sortOrder: number;
  isFeatured: boolean;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  service?: Service | null;
  /** Present on booking details, which nest category below subCategory. */
  category?: Category | null;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  isFeatured: boolean;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  /** Nested on booking details: `package.service.subCategory.category`. */
  subCategory?: SubCategory | null;
}

export interface PackageRecord {
  id: string;
  serviceId: string;
  subCategoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  defaultPrice: number;
  offerPrice: number | null;
  durationMinutes: number;
  sortOrder: number;
  isFeatured: boolean;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  subCategory?: SubCategory | null;
  service?: Service | null;
}

export interface PackageDetailImage {
  id: string;
  packageId: string;
  image: string;
  title: string | null;
  sortOrder: number;
}

export interface PackageDetailIncluded {
  id: string;
  packageId: string;
  title: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export interface PackageDetailExcluded {
  id: string;
  packageId: string;
  title: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export interface PackageDetailBenefit {
  id: string;
  packageId: string;
  title: string;
  description: string;
  image: string | null;
  sortOrder: number;
}

export interface PackageDetailHowItWorks {
  id: string;
  packageId: string;
  step: number;
  title: string;
  description: string;
  image: string | null;
}

export interface PackageDetailFaq {
  id: string;
  packageId: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface PackageDetailsResponse {
  package: {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    defaultPrice: number;
    offerPrice: number | null;
    durationMinutes: number;
  };
  description: string | null;
  whyChooseUs: string | null;
  images: PackageDetailImage[];
  included: PackageDetailIncluded[];
  excluded: PackageDetailExcluded[];
  howItWorks: PackageDetailHowItWorks[];
  benefits: PackageDetailBenefit[];
  faqs: PackageDetailFaq[];
}

/**
 * Body of `POST|PUT /api/v1/packages/:packageId/details`.
 *
 * The route has no upload middleware, so every `image` is an already uploaded
 * path/URL. `PUT` deletes every existing detail row before recreating them, so
 * the payload must always contain the full state of each collection.
 */
export interface PackageDetailsPayload {
  description?: string | null;
  whyChooseUs?: string | null;
  images?: Array<{ image: string; title?: string | null; sortOrder?: number }>;
  included?: Array<{
    title: string;
    description?: string | null;
    image?: string | null;
    sortOrder?: number;
  }>;
  excluded?: Array<{
    title: string;
    description?: string | null;
    image?: string | null;
    sortOrder?: number;
  }>;
  benefits?: Array<{
    title: string;
    description: string;
    image?: string | null;
    sortOrder?: number;
  }>;
  howItWorks?: Array<{
    step: number;
    title: string;
    description: string;
    image?: string | null;
  }>;
  faqs?: Array<{ question: string; answer: string; sortOrder?: number }>;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  status?: RecordStatus;
  image?: File | null;
}

export interface SubCategoryPayload {
  serviceId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  status?: RecordStatus;
  /** Sent as JSON: the sub-category routes have no upload middleware. */
  image?: string | null;
}

export interface ServicePayload {
  categoryId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  status?: RecordStatus;
  image?: File | null;
}

export interface PackagePayload {
  serviceId: string;
  subCategoryId: string;
  name: string;
  defaultPrice: number;
  durationMinutes: number;
  description?: string | null;
  offerPrice?: number | null;
  sortOrder?: number;
  isFeatured?: boolean;
  status?: RecordStatus;
  image?: File | null;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  googlePlaceId: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: RecordStatus;
  sortOrder: number;
}

export interface Area {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  googlePlaceId: string | null;
  latitude: number | null;
  longitude: number | null;
  pincode: string | null;
  status: RecordStatus;
  sortOrder: number;
}

/* -------------------------------------------------------------------------- */
/*                                   Reviews                                   */
/* -------------------------------------------------------------------------- */

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  packageId: string;
  rating: number;
  review: string | null;
  images: string[];
  status: ReviewStatus;
  adminReply: string | null;
  adminReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; firstName: string | null; lastName: string | null; profileImage: string | null };
  provider?: { id: string; businessName: string; ownerName: string };
  package?: { id: string; name: string };
}

export interface ReviewUpdatePayload {
  rating?: number;
  review?: string;
  status?: ReviewStatus;
  adminReply?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Support                                   */
/* -------------------------------------------------------------------------- */

export interface SupportConversation {
  id: string;
  userId: string;
  assignedAgentId: string | null;
  bookingId: string | null;
  subject: string | null;
  status: SupportConversationStatus;
  lastMessageAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; firstName: string | null; lastName: string | null; mobile: string; profileImage: string | null };
  messages?: SupportMessage[];
  lastMessage?: SupportMessage | null;
  unreadCount?: number;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: SenderRole;
  message: string | null;
  messageType: SupportMessageType;
  attachment: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface CreateConversationPayload {
  bookingId?: string;
  subject?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Notifications                                */
/* -------------------------------------------------------------------------- */

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  referenceId: string | null;
  image: string | null;
  isRead: boolean;
  readAt: string | null;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface RegisterDevicePayload {
  token: string;
  platform: DevicePlatform;
  deviceId: string;
}