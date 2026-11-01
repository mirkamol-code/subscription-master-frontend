import { subscriptionStatuses, type SubscriptionStatus } from '@/types/api'
import type { AdminUserListParams } from '@/features/admin/types'

export const USER_PAGE_SIZE = 20

export const JOINED_OPTIONS = [
  { value: '', label: 'Joined any time' },
  { value: '7', label: 'Joined in last 7 days' },
  { value: '30', label: 'Joined in last 30 days' },
] as const

export const LOGGED_IN_OPTIONS = [
  { value: '', label: 'Any last login' },
  { value: '1', label: 'Logged in last 24 hours' },
  { value: '7', label: 'Logged in last 7 days' },
  { value: '30', label: 'Logged in last 30 days' },
] as const

export const USER_SORT_OPTIONS = [
  { value: 'createdAt,DESC', label: 'Newest signups' },
  { value: 'createdAt,ASC', label: 'Oldest signups' },
  { value: 'lastLoginAt,DESC', label: 'Recent logins' },
  { value: 'lastLoginAt,ASC', label: 'Longest since login' },
  { value: 'email,ASC', label: 'Email: A–Z' },
  { value: 'email,DESC', label: 'Email: Z–A' },
  { value: 'displayName,ASC', label: 'Name: A–Z' },
] as const

export const DEFAULT_USER_SORT = USER_SORT_OPTIONS[0].value

export interface UserListFilters {
  search: string
  joined: string
  loggedIn: string
  status: SubscriptionStatus | ''
  merchant: string
  sort: string
  page: number
}

function pickAllowed(value: string | null, allowed: readonly { value: string }[], fallback: string) {
  return allowed.some((option) => option.value === value) ? (value as string) : fallback
}

function isSubscriptionStatus(value: string | null): value is SubscriptionStatus {
  return subscriptionStatuses.some((status) => status === value)
}

export function readUserListFilters(params: URLSearchParams): UserListFilters {
  const status = params.get('status')
  return {
    search: params.get('search') ?? '',
    joined: pickAllowed(params.get('joined'), JOINED_OPTIONS, ''),
    loggedIn: pickAllowed(params.get('loggedIn'), LOGGED_IN_OPTIONS, ''),
    status: isSubscriptionStatus(status) ? status : '',
    merchant: params.get('merchant') ?? '',
    sort: pickAllowed(params.get('sort'), USER_SORT_OPTIONS, DEFAULT_USER_SORT),
    page: Math.max(Math.trunc(Number(params.get('page'))) || 0, 0),
  }
}

export function toUserListParams(filters: UserListFilters): AdminUserListParams {
  const search = filters.search.trim()
  return {
    ...(search && { search }),
    ...(filters.joined && { joinedWithinDays: Number(filters.joined) }),
    ...(filters.loggedIn && { loggedInWithinDays: Number(filters.loggedIn) }),
    ...(filters.status && { status: filters.status }),
    ...(filters.merchant && { merchant: filters.merchant }),
    sort: filters.sort,
    page: filters.page,
    size: USER_PAGE_SIZE,
  }
}
