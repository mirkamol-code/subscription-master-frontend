import { api } from '@/api/client'
import type { AdminUsage, MonthlyCost, SpendingSummary } from '@/types/api'

export const statisticsApi = {
  // Short timeout: the dashboard computes the summary itself when the server is slow.
  summary: async () =>
    (await api.get<SpendingSummary>('/statistics/summary', { timeout: 3_000 })).data,
  monthlyDynamics: async (months = 6) =>
    (await api.get<MonthlyCost[]>('/statistics/monthly-dynamics', { params: { months } })).data,
  adminUsage: async () =>
    (await api.get<AdminUsage[]>('/admin/statistics/service-usage')).data,
}

