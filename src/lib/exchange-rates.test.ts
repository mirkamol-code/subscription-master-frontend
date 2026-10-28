import { describe, expect, it } from 'vitest'
import { toConversionTable } from '@/lib/exchange-rates'

describe('toConversionTable', () => {
  const table = toConversionTable({ USD: 12850, EUR: 13967.5, UZS: 1 })!

  it('keeps the server rate for converting to UZS', () => {
    expect(table.USD.UZS).toBe(12850)
    expect(table.EUR.UZS).toBe(13967.5)
    expect(table.UZS.UZS).toBe(1)
  })

  it('derives cross rates between foreign currencies', () => {
    expect(table.EUR.USD).toBeCloseTo(13967.5 / 12850, 12)
    expect(table.USD.EUR).toBeCloseTo(12850 / 13967.5, 12)
    expect(table.UZS.USD).toBeCloseTo(1 / 12850, 12)
  })

  it('converts there and back without drift', () => {
    expect(10 * table.USD.UZS * table.UZS.USD).toBeCloseTo(10, 12)
  })

  it('returns null when a rate is missing or not a positive number', () => {
    expect(toConversionTable({ USD: 12850 })).toBeNull()
    expect(toConversionTable({ USD: 0, EUR: 13967.5 })).toBeNull()
    expect(toConversionTable({ USD: Number.NaN, EUR: 13967.5 })).toBeNull()
  })
})
