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

export function useAdminUsage(options?: { enabled?: boolean }) {
  const hasToken = !!tokenStore.get()?.accessToken
  const enabled = options?.enabled ?? hasToken
  return useQuery({
    queryKey: ['admin', 'service-usage'],
    queryFn: statisticsApi.adminUsage,
    retry: false,
    enabled: hasToken && enabled,
    staleTime: 5 * 60_000,
  })
}

export function useIsAdmin() {
  const jwtAdmin = tokenStore.hasAdminRole()
  const query = useAdminUsage({ enabled: jwtAdmin === null || jwtAdmin === true })

  if (jwtAdmin === false) {
    return { isAdmin: false, isLoading: false }
  }

  return {
    isAdmin: jwtAdmin === true || (query.isSuccess && Array.isArray(query.data)),
    isLoading: jwtAdmin === null ? query.isLoading : false,
  }
}
