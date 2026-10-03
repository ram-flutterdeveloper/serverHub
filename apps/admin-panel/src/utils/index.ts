import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return dayjs(date).format('MMM DD, YYYY');
}

export function formatDateTime(date: string): string {
  return dayjs(date).format('MMM DD, YYYY h:mm A');
}

export function formatRelativeTime(date: string): string {
  return dayjs(date).fromNow();
}

export function getStatusColor(status: string): 'success' | 'error' | 'warning' | 'info' | 'default' {
  const normalized = status.toLowerCase().replace(/[\s_-]/g, '');
  const successStatuses = ['active', 'approved', 'completed', 'paid', 'delivered', 'verified', 'online', 'open', 'accepted', 'published', 'resolved', 'success'];
  const errorStatuses = ['inactive', 'rejected', 'failed', 'refunded', 'banned', 'suspended', 'offline', 'closed', 'declined', 'cancelled', 'error'];
  const warningStatuses = ['pending', 'processing', 'inprogress', 'review', 'awaiting', 'onhold', 'warning'];
  const infoStatuses = ['new', 'draft', 'archived', 'info'];

  if (successStatuses.some((s) => normalized.includes(s))) return 'success';
  if (errorStatuses.some((s) => normalized.includes(s))) return 'error';
  if (warningStatuses.some((s) => normalized.includes(s))) return 'warning';
  if (infoStatuses.some((s) => normalized.includes(s))) return 'info';
  return 'default';
}

export function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Builds a display phone number. The backend stores `countryCode` with its
 * leading `+` already included (e.g. `+91`), so only add it when missing.
 */
export function formatPhone(mobile?: string | null, countryCode?: string | null): string {
  if (!mobile) return countryCode ?? '—';
  const code = (countryCode ?? '').trim();
  if (!code) return mobile;
  return code.startsWith('+') ? `${code} ${mobile}` : `+${code} ${mobile}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getRatingColor(rating: number): string {
  if (rating < 3) return '#EF4444';
  if (rating < 4) return '#F59E0B';
  return '#10B981';
}

export function getRatingLabel(rating: number): string {
  if (rating < 1) return 'Poor';
  if (rating < 2) return 'Fair';
  if (rating < 3) return 'Good';
  if (rating < 4) return 'Very Good';
  return 'Excellent';
}
