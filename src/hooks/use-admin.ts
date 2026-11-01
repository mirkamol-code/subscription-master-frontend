import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/endpoints/admin'
import type { AdminUserListParams, AnalyticsRange } from '@/features/admin/types'
import type { Category } from '@/types/api'

const ADMIN_STALE_MS = 60_000

export function useAdminOverview() {
  return useQuery({ queryKey: ['admin', 'overview'], queryFn: adminApi.overview, retry: false, staleTime: ADMIN_STALE_MS })
}

export function useAdminUsers(params: AdminUserListParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.users(params),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: ADMIN_STALE_MS,
  })
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminApi.user(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  })
}

export function useAdminUserLogins(id: number, page: number) {
  return useQuery({
    queryKey: ['admin', 'user', id, 'logins', page],
    queryFn: () => adminApi.logins(id, page),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useAdminUserSubscriptions(id: number) {
  return useQuery({
    queryKey: ['admin', 'user', id, 'subscriptions'],
    queryFn: () => adminApi.subscriptions(id),
    retry: false,
  })
}

export function useAdminUserPayments(id: number, page: number) {
  return useQuery({
    queryKey: ['admin', 'user', id, 'payments', page],
    queryFn: () => adminApi.payments(id, page),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useMerchantOptions() {
  return useQuery({
    queryKey: ['admin', 'merchants'],
    queryFn: adminApi.merchants,
    retry: false,
    staleTime: 5 * ADMIN_STALE_MS,
  })
}

export function useMerchantAnalytics(range: AnalyticsRange, category?: Category) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'merchants', range, category ?? null],
    queryFn: () => adminApi.merchantAnalytics(range, category),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: ADMIN_STALE_MS,
  })
}

export function useCategoryAnalytics(range: AnalyticsRange) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'categories', range],
    queryFn: () => adminApi.categoryAnalytics(range),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: ADMIN_STALE_MS,
  })
}
