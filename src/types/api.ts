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
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string[]
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
  byCategory: Array<{ category: Category; monthlyCostUzs: number }>
}

export interface MonthlyCost {
  month: string
  costUzs: number
}

export interface AdminUsage {
  serviceName: string
  subscriptionCount: number
}

