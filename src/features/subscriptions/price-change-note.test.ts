import { describe, expect, it } from 'vitest'
import { describePriceChange } from '@/features/subscriptions/price-change-note'

describe('describePriceChange', () => {
  it('shows old price, new price and effective date from a notice', () => {
    // when
    const note = describePriceChange({
      oldAmount: 22.99,
      newAmount: 24.99,
      currency: 'USD',
      effectiveOn: '2026-12-30',
      source: 'NOTICE',
    })

    // then
    expect(note).toBe('Price changes from $22.99 to $24.99 on Dec 30, 2026.')
  })

  it('describes a change seen on an invoice in the past tense', () => {
    // when
    const note = describePriceChange({
      oldAmount: 19.99,
      newAmount: 22.99,
      currency: 'USD',
      effectiveOn: '2026-10-30',
      source: 'INVOICE',
    })

    // then
    expect(note).toBe('Price changed from $19.99 to $22.99 on Oct 30, 2026.')
  })

  it('shows nothing when the email gave no price or date', () => {
    // when
    const note = describePriceChange({ oldAmount: null, newAmount: null, currency: null, effectiveOn: null, source: 'NOTICE' })

    // then
    expect(note).toBeNull()
  })

  it('shows nothing when there is no price change', () => {
    // then
    expect(describePriceChange(null)).toBeNull()
  })
})
