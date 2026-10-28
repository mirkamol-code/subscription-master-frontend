import { useQuery, useQueryClient } from '@tanstack/react-query'
import { statisticsApi } from '@/api/endpoints/statistics'
import {
  currencyRatesKey,
  fetchLiveExchangeRates,
  toUzs,
  type ExchangeRates,
} from '@/hooks/use-currency-rates'
import { fetchAllSubscriptions } from '@/hooks/use-subscriptions'
import { isRenewing } from '@/lib/renewals'
import { tokenStore } from '@/lib/token-store'
import { getMonthlyEquivalent, roundMoney } from '@/lib/utils'
import type { Category, Currency, SpendingSummary, Subscription } from '@/types/api'

function buildSummaryFromSubscriptions(
  subscriptions: Subscription[],
  rates: Record<Currency, ExchangeRates>,
): SpendingSummary {
  let mostExpensive: SpendingSummary['mostExpensive']
  const categoryTotals = new Map<Category, number>()

  for (const sub of subscriptions.filter(isRenewing)) {
    const monthlyCostUzs = roundMoney(toUzs(getMonthlyEquivalent(sub.price, sub.frequency), sub.currency, rates))
    categoryTotals.set(sub.category, (categoryTotals.get(sub.category) ?? 0) + monthlyCostUzs)
    if (!mostExpensive || monthlyCostUzs > mostExpensive.monthlyCostUzs) {
      mostExpensive = { subscriptionId: sub.id, subscriptionName: sub.name, monthlyCostUzs }
    }
  }

  const byCategory = Array.from(categoryTotals, ([category, cost]) => ({
    category,
    monthlyCostUzs: roundMoney(cost),
    currency: 'UZS',
  })).sort((a, b) => b.monthlyCostUzs - a.monthlyCostUzs)

  return {
    monthlyTotalUzs: roundMoney(byCategory.reduce((sum, item) => sum + item.monthlyCostUzs, 0)),
    baseCurrency: 'UZS',
    mostExpensive,
    byCategory,
  }
}

export function useSummary() {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['statistics', 'summary'],
    queryFn: async () => {
      try {
        return await statisticsApi.summary()
      } catch {
        // The server summary can time out while it fetches exchange rates; compute it here instead,
        // using the same rates the rest of the screen already shows.
        const rates =
          queryClient.getQueryData<Awaited<ReturnType<typeof fetchLiveExchangeRates>>>(currencyRatesKey)
            ?.rates ?? (await fetchLiveExchangeRates()).rates
        return buildSummaryFromSubscriptions(await fetchAllSubscriptions(), rates)
      }
    },
    retry: 0,
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
