import type { Currency } from '@/types/api'

export interface ExchangeRates {
  USD: number
  EUR: number
  UZS: number
}

/**
 * Turns the server's "1 unit = X UZS" rates into a full conversion table, so any pair can be
 * converted with one lookup. Returns null when a rate is missing or not a positive number.
 */
export function toConversionTable(
  ratesToUzs: Partial<Record<Currency, number>>,
): Record<Currency, ExchangeRates> | null {
  const usd = ratesToUzs.USD
  const eur = ratesToUzs.EUR
  if (!isPositive(usd) || !isPositive(eur)) return null

  const toUzs: Record<Currency, number> = { USD: usd, EUR: eur, UZS: 1 }
  const row = (from: Currency): ExchangeRates => ({
    USD: toUzs[from] / toUzs.USD,
    EUR: toUzs[from] / toUzs.EUR,
    UZS: toUzs[from],
  })
  return { USD: row('USD'), EUR: row('EUR'), UZS: row('UZS') }
}

function isPositive(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}
