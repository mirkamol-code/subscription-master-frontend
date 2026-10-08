import { api } from '@/api/client'
import type { AdminUsage, MonthlyCost, SpendingSummary } from '@/types/api'

export const statisticsApi = {
  summary: async () => (await api.get<SpendingSummary>('/statistics/summary')).data,
  monthlyDynamics: async (months = 6) =>
    (await api.get<MonthlyCost[]>('/statistics/monthly-dynamics', { params: { months } })).data,
  adminUsage: async () =>
    (await api.get<AdminUsage[]>('/admin/statistics/service-usage')).data,
}

