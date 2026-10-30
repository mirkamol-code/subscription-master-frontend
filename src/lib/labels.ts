import type { Currency, Frequency, SubscriptionStatus } from '@/types/api'

export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Active',
  CANCELLED: 'Cancelled',
  BILLING_REQUIRED: 'Billing required',
}

export function getStatusLabel(status: string): string {
  const known = STATUS_LABEL[status as SubscriptionStatus]
  if (known) return known
  const words = status.toLowerCase().replace(/_/g, ' ').trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Unknown'
}

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  ANNUAL: 'Yearly',
}

export const FREQUENCY_SUFFIX: Record<Frequency, string> = {
  WEEKLY: '/wk',
  MONTHLY: '/mo',
  ANNUAL: '/yr',
}

export const CURRENCY_META: Record<Currency, { flag: string; name: string }> = {
  UZS: { flag: '🇺🇿', name: 'Uzbek som' },
  USD: { flag: '🇺🇸', name: 'US dollar' },
  EUR: { flag: '🇪🇺', name: 'Euro' },
}
