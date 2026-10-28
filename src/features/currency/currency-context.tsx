import { createContext, useContext, useState, type ReactNode } from 'react'
import { currencies, type Currency } from '@/types/api'
import { useCurrencyRates, type ExchangeRates } from '@/hooks/use-currency-rates'

const CURRENCY_STORAGE_KEY = 'subscription-master.display-currency'

interface CurrencyContextValue {
  displayCurrency: Currency
  setDisplayCurrency: (currency: Currency) => void
  rates: Record<Currency, ExchangeRates>
  convert: (amount: number, from: Currency, to: Currency) => number
  convertToDisplay: (amount: number, from?: Currency) => number
  lastUpdated: string
  isLive: boolean
  refreshRates: () => void
  isRefetching: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY)
      if (currencies.includes(stored as Currency)) return stored as Currency
    } catch {
      // ignore
    }
    return 'UZS'
  })

  const { rates, lastUpdated, isLive, convert, refetch, isRefetching } = useCurrencyRates()

  const setDisplayCurrency = (currency: Currency) => {
    setDisplayCurrencyState(currency)
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
    } catch {
      // ignore
    }
  }

  const convertToDisplay = (amount: number, from: Currency = 'UZS') => {
    return convert(amount, from, displayCurrency)
  }

  return (
    <CurrencyContext.Provider
      value={{
        displayCurrency,
        setDisplayCurrency,
        rates,
        convert,
        convertToDisplay,
        lastUpdated,
        isLive,
        refreshRates: () => void refetch(),
        isRefetching,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components -- provider and hook intentionally share one context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
