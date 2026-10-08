import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '@/api/endpoints/statistics'

export function useSummary() {
  return useQuery({
    queryKey: ['statistics', 'summary'],
    queryFn: statisticsApi.summary,
    staleTime: 2 * 60_000, // Summary changes only when subscriptions are mutated
  })
}

export function useMonthlyDynamics(months = 6) {
  return useQuery({
    queryKey: ['statistics', 'monthly-dynamics', months],
    queryFn: () => statisticsApi.monthlyDynamics(months),
    staleTime: 2 * 60_000, // Historical monthly data changes infrequently
  })
}

export function useAdminUsage() {
  return useQuery({
    queryKey: ['admin', 'service-usage'],
    queryFn: statisticsApi.adminUsage,
    retry: false,
    staleTime: 5 * 60_000, // Admin aggregate data is low-churn
  })
}

