import { describe, expect, it } from 'vitest'
import { receiptAmountSchema } from '@/schemas/receipt-amount'

function firstError(input: unknown) {
  const result = receiptAmountSchema.safeParse(input)
  return result.success ? undefined : result.error.issues[0]?.message
}

describe('receiptAmountSchema', () => {
  it('accepts a positive amount in a supported currency', () => {
    // when
    const result = receiptAmountSchema.safeParse({ amount: 20, currency: 'USD' })

    // then
    expect(result).toEqual({ success: true, data: { amount: 20, currency: 'USD' } })
  })

  it('rejects a zero amount', () => {
    // when
    const message = firstError({ amount: 0, currency: 'USD' })

    // then
    expect(message).toBe('Amount must be at least 0.01')
  })

  it('rejects an empty amount field', () => {
    // when
    const message = firstError({ amount: Number.NaN, currency: 'USD' })

    // then
    expect(message).toBe('Enter the amount from the receipt')
  })

  it('rejects a currency the app does not support', () => {
    // when
    const result = receiptAmountSchema.safeParse({ amount: 20, currency: 'BTC' })

    // then
    expect(result.success).toBe(false)
  })
})
