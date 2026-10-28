import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '@/api/endpoints/statistics'
import { tokenStore } from '@/lib/token-store'

export function useSummary() {
  return useQuery({
    queryKey: ['statistics', 'summary'],
    queryFn: statisticsApi.summary,
    staleTime: 2 * 60_000,
  })
}

export function useMonthlyDynamics(months = 6) {
  return useQuery({
    queryKey: ['statistics', 'monthly-dynamics', months],
    queryFn: () => statisticsApi.monthlyDynamics(months),
    staleTime: 2 * 60_000,
  })
}

export function useAdminUsage() {
  return useQuery({
    queryKey: ['admin', 'service-usage'],
    queryFn: statisticsApi.adminUsage,
    retry: false,
    enabled: !!tokenStore.get()?.accessToken,
    staleTime: 5 * 60_000,
  })
}
