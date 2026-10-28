import { useQuery } from '@tanstack/react-query'
import { currenciesApi } from '@/api/endpoints/currencies'
import { toConversionTable, type ExchangeRates } from '@/lib/exchange-rates'
import type { Currency } from '@/types/api'

export type { ExchangeRates }

// Used only while the server's rates can't be loaded; the UI then shows them as "Offline".
export const FALLBACK_RATES: Record<Currency, ExchangeRates> = {
  USD: { USD: 1, EUR: 0.92, UZS: 12850 },
  EUR: { USD: 1.087, EUR: 1, UZS: 13967 },
  UZS: { USD: 1 / 12850, EUR: 1 / 13967, UZS: 1 },
}

export const currencyRatesKey = ['currency-rates'] as const

/** Converts an amount to Uzbek som, falling back to built-in rates for a missing pair. */
export function toUzs(
  amount: number,
  currency: Currency,
  rates: Record<Currency, ExchangeRates> = FALLBACK_RATES,
): number {
  return amount * (rates[currency]?.UZS ?? FALLBACK_RATES[currency].UZS)
}

/** The same CBU rates the server uses for totals, reports and payments. */
export async function fetchLiveExchangeRates(): Promise<{
  rates: Record<Currency, ExchangeRates>
  lastUpdated: string
  isLive: boolean
}> {
  try {
    const response = await currenciesApi.rates()
    const rates = toConversionTable(response.rates)
    if (rates) {
      return {
        rates,
        lastUpdated: new Date(response.updatedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isLive: true,
      }
    }
  } catch {
    // Fall back to the built-in rates below.
  }

  return {
    rates: FALLBACK_RATES,
    lastUpdated: 'Offline',
    isLive: false,
  }
}

export function useCurrencyRates() {
  const query = useQuery({
    queryKey: currencyRatesKey,
    queryFn: fetchLiveExchangeRates,
    staleTime: 10 * 60_000, // 10 minutes
    refetchInterval: 15 * 60_000, // Background refresh every 15 mins
  })

  const rates = query.data?.rates ?? FALLBACK_RATES
  const lastUpdated = query.data?.lastUpdated ?? '—'
  const isLive = query.data?.isLive ?? false

  const convert = (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount
    const rate = rates[from]?.[to] ?? FALLBACK_RATES[from][to]
    return amount * rate
  }

  return {
    rates,
    lastUpdated,
    isLive,
    convert,
    isLoading: query.isLoading,
    refetch: query.refetch,
    isRefetching: query.isFetching,
  }
}
