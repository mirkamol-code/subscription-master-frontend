import type { Category, Currency, Frequency, SubscriptionStatus } from '@/types/api'

export type AdminRole = 'ADMIN' | 'USER'

export interface AdminOverview {
  signupsToday: number
  signupsLast7Days: number
  signupsLast30Days: number
  activeSubscribers: number
  loginsLast24Hours: number
  paymentsDueNext7Days: number
  paymentsDueNext7DaysTotalUzs: number | null
}

export interface AdminUserRow {
  id: number
  email: string
  displayName: string | null
  avatarUrl: string | null
  role: AdminRole
  createdAt: string
  lastLoginAt: string | null
  activeSubscriptions: number
  merchantNames: string[]
  status: SubscriptionStatus | null
}

export interface AdminUser {
  id: number
  email: string
  displayName: string | null
  avatarUrl: string | null
  role: AdminRole
  timeZone: string
  createdAt: string
  lastLoginAt: string | null
}

export interface LoginEvent {
  id: number
  occurredAt: string
  ip: string | null
  userAgent: string | null
  device?: string | null
  browser?: string | null
  os?: string | null
  city?: string | null
  country?: string | null
}

export interface AdminSubscription {
  id: number
  name: string
  merchant: string | null
  price: number
  currency: Currency
  frequency: Frequency
  status: SubscriptionStatus
  category: Category
  startDate: string
  nextPaymentDate: string
  endsOn: string | null
  hidden: boolean
  deleted: boolean
  createdAt: string
}

export interface AdminPayment {
  id: number
  subscriptionId: number
  subscriptionName: string
  paidOn: string
  amount: number
  currency: Currency
  amountUzs: number
}

export interface MerchantOption {
  slug: string
  name: string
}

export interface AdminUserListParams {
  search?: string
  joinedWithinDays?: number
  loggedInWithinDays?: number
  status?: SubscriptionStatus
  merchant?: string
  sort: string
  page: number
  size: number
}

export const analyticsRanges = ['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'ALL_TIME'] as const
export type AnalyticsRange = (typeof analyticsRanges)[number]

export interface MerchantAnalytics {
  rank: number
  slug: string
  name: string
  activeSubscribers: number
  activeSubscriptions: number
  sharePercent: number
  newLast7Days: number
  newLast30Days: number
  cancelledInRange: number
  trackedSpendUzs: number
  averageSpendPerUserUzs: number | null
  loginsPerUser: number | null
}

export interface CategoryAnalytics {
  category: Category
  activeSubscribers: number
  activeSubscriptions: number
  sharePercent: number
  trackedSpendUzs: number
}

export type DueBucket = 'OVERDUE' | 'PASSED' | 'TODAY' | 'NEXT_3_DAYS' | 'NEXT_7_DAYS' | 'LATER'

export interface PaymentDue {
  subscriptionId: number
  userId: number
  userName: string
  userEmail: string
  merchant: string
  merchantSlug: string | null
  kind: 'PAYMENT' | 'ACCESS_END'
  dueDate: string
  amount: number | null
  currency: Currency
  amountUzs: number | null
  status: SubscriptionStatus
  bucket: DueBucket
}

export interface DuePayments {
  today: string
  timeZone: string
  entries: PaymentDue[]
}

export interface UpcomingPayments extends DuePayments {
  totalUzs: number
  overdueTotalUzs: number
}

export interface DuePaymentParams {
  from: string
  to: string
  merchant?: string
  status?: SubscriptionStatus
}

export type VisibleRange = Pick<DuePaymentParams, 'from' | 'to'>
