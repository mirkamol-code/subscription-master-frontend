export const currencies = ['UZS', 'USD', 'EUR'] as const
export const frequencies = ['WEEKLY', 'MONTHLY', 'ANNUAL'] as const
export const subscriptionStatuses = ['ACTIVE', 'PAUSED', 'CANCELLED'] as const
export const categories = [
  'ENTERTAINMENT',
  'PRODUCTIVITY',
  'AI_TOOLS',
  'EDUCATION',
  'HEALTH',
  'FINANCE',
  'OTHER',
] as const

export type Currency = (typeof currencies)[number]
export type Frequency = (typeof frequencies)[number]
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]
export type Category = (typeof categories)[number]

export interface SubscriptionRequest {
  name: string
  price: number
  currency: Currency
  frequency: Frequency
  status: SubscriptionStatus
  category: Category
  startDate: string
  /** The version being edited; the server rejects the update with 409 if it has changed since. */
  version?: number
}

export interface Subscription extends SubscriptionRequest {
  id: number
  nextPaymentDate: string
  version: number
}

export interface Page<T> {
  totalElements: number
  totalPages: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus
  currency?: Currency
  category?: Category
  name?: string
  nextPaymentDateFrom?: string
  nextPaymentDateTo?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string[]
}

export interface PaymentHistory {
  id: number
  chargedAt: string
  amount: number
  currency: Currency
  amountUzs: number
  exchangeRateToUzs?: number
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
}

export interface SpendingSummary {
  monthlyTotalUzs: number
  baseCurrency: string
  mostExpensive?: {
    subscriptionId: number
    subscriptionName: string
    monthlyCostUzs: number
  }
  byCategory: Array<{ category: Category; monthlyCostUzs: number; currency?: string }>
}

export interface UserProfile {
  id: number
  email: string
  roles: string[]
  baseCurrency: string
  createdAt: string
}

export interface ExchangeRatesResponse {
  baseCurrency: string
  /** How many UZS one unit of each currency is worth. */
  rates: Partial<Record<Currency, number>>
  updatedAt: string
}

export interface MonthlyCost {
  month: string
  costUzs: number
}

export interface AdminUsage {
  serviceName: string
  subscriptionCount: number
}
