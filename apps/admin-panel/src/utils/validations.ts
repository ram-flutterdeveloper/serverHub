import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.string().min(1, 'Role is required'),
});

export const providerSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be at least 0'),
  priceType: z.string().min(1, 'Price type is required'),
});

export const packageSchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be at least 0'),
  duration: z.number().min(1, 'Duration must be at least 1'),
});

export const citySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
});

export const areaSchema = z.object({
  name: z.string().min(1, 'Area name is required'),
  cityId: z.string().min(1, 'City is required'),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters'),
  type: z.enum(['percentage', 'fixed'], { required_error: 'Coupon type is required' }),
  value: z.number().min(1, 'Value must be at least 1'),
  minOrderAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
});

export const cmsPageSchema = z.object({
  title: z.string().min(1, 'Page title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export const blogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type ProviderFormData = z.infer<typeof providerSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;
export type CityFormData = z.infer<typeof citySchema>;
export type AreaFormData = z.infer<typeof areaSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type CmsPageFormData = z.infer<typeof cmsPageSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
