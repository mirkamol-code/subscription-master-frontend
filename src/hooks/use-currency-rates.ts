import { useQuery } from '@tanstack/react-query'
import type { Currency } from '@/types/api'

export interface ExchangeRates {
  USD: number
  EUR: number
  UZS: number
}

// Fallback rates if network is offline or external rate API is unreachable
export const FALLBACK_RATES: Record<Currency, ExchangeRates> = {
  USD: { USD: 1, EUR: 0.92, UZS: 12850 },
  EUR: { USD: 1.087, EUR: 1, UZS: 13967 },
  UZS: { USD: 1 / 12850, EUR: 1 / 13967, UZS: 1 },
}

interface OpenRateResponse {
  result: string
  rates: Record<string, number>
  time_last_update_utc?: string
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

export async function fetchLiveExchangeRates(): Promise<{
  rates: Record<Currency, ExchangeRates>
  lastUpdated: string
  isLive: boolean
}> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!response.ok) throw new Error('Failed to fetch rates')
    const data = (await response.json()) as OpenRateResponse

    if (data.result === 'success' && data.rates.UZS && data.rates.EUR) {
      const usdToUzs = data.rates.UZS
      const usdToEur = data.rates.EUR

      const rates: Record<Currency, ExchangeRates> = {
        USD: { USD: 1, EUR: usdToEur, UZS: usdToUzs },
        EUR: { USD: 1 / usdToEur, EUR: 1, UZS: usdToUzs / usdToEur },
        UZS: { USD: 1 / usdToUzs, EUR: usdToEur / usdToUzs, UZS: 1 },
      }

      return {
        rates,
        lastUpdated: data.time_last_update_utc
          ? new Date(data.time_last_update_utc).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Just now',
        isLive: true,
      }
    }
  } catch {
    // Silently fallback to built-in current rates
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
