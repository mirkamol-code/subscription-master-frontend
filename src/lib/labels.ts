import type { Currency, Frequency, SubscriptionStatus } from '@/types/api'

export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  CANCELLED: 'Cancelled',
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
