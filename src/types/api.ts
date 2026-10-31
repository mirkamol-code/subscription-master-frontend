export const currencies = ['UZS', 'USD', 'EUR'] as const
export const frequencies = ['WEEKLY', 'MONTHLY', 'ANNUAL'] as const
export const subscriptionStatuses = ['ACTIVE', 'CANCELLED', 'BILLING_REQUIRED'] as const
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

export interface ReceiptAmountRequest {
  amount: number
  currency: Currency
}

export interface Subscription extends SubscriptionRequest {
  id: number
  nextPaymentDate: string
  version: number
  merchantKey: string | null
  needsReview: boolean
  reviewReason: 'AMOUNT_UNREADABLE' | null
  reviewNote: string | null
  hidden: boolean
  lastPaymentDate: string | null
  logoDomain: string | null
  endsOn: string | null
}

export type StatusChangeReason =
  | 'EMAIL_RECEIPT'
  | 'EMAIL_CANCELLATION'
  | 'CANCELLATION_SCHEDULED'
  | 'EMAIL_PAYMENT_FAILED'
  | 'USER'
  | 'OVERDUE'
  | 'SCHEDULED_END'

export interface StatusChange {
  id: number
  fromStatus: SubscriptionStatus | null
  toStatus: SubscriptionStatus
  reason: StatusChangeReason
  source: 'EMAIL' | 'USER' | 'SYSTEM'
  effectiveAt: string
  endsOn: string | null
  billingEmailId: number | null
  gmailMessageId: string | null
  emailSender: string | null
  emailSubject: string | null
  emailReceivedAt: string | null
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
  hidden?: boolean
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
  displayName: string | null
  avatarUrl: string | null
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

export interface GmailConnection {
  connected: boolean
  gmailAddress: string | null
  status: 'CONNECTED' | 'DISCONNECTED' | 'NOT_CONNECTED'
}

export interface GmailSyncStatus {
  state: 'IDLE' | 'RUNNING' | 'FAILED'
  processed: number
  total: number
  lastSyncedAt: string | null
  error: 'RECONNECT_REQUIRED' | 'SOME_EMAILS_FAILED' | 'SYNC_FAILED' | null
}

export interface BillingEmailAttachment {
  id: number
  filename: string
  mimeType: string
  sizeBytes: number
}

export interface BillingEmail {
  id: number
  gmailMessageId: string
  kind: 'RECEIPT' | 'CANCELLATION' | 'PAYMENT_FAILED' | 'IRRELEVANT'
  sender: string | null
  subject: string | null
  receivedAt: string
  confidence: 'HIGH' | 'LOW'
  amountUnreadable: boolean
  attachments: BillingEmailAttachment[]
}

export interface AppNotification {
  id: number
  type: 'PAYMENT_DUE' | 'BILLING_REQUIRED' | 'CANCELLED' | 'CANCELLATION_SCHEDULED' | 'REACTIVATED' | 'RETRACKED'
  severity: 'INFO' | 'URGENT'
  title: string
  body: string
  subscriptionId: number | null
  link: string | null
  read: boolean
  createdAt: string
}

export interface NotificationSettings {
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  daysBefore: number
  timeZone: string
}

export interface EmailContent {
  html: string
  contentSecurityPolicy: string | null
  blockedRemoteImages: number
}

export interface PushSubscriptionRequest {
  endpoint: string
  keys: { p256dh: string; auth: string }
}
