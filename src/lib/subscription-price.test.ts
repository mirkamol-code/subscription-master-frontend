import { describe, expect, it } from 'vitest'
import { formatSubscriptionPrice, hasKnownPrice } from '@/lib/subscription-price'

describe('subscription price', () => {
  it('formats a known price with its cycle', () => {
    // when
    const text = formatSubscriptionPrice({ price: 22.99, currency: 'USD', frequency: 'MONTHLY', status: 'ACTIVE' })

    // then
    expect(text).toBe('$22.99/mo')
  })

  it('says a free trial has no charge yet when its later price is unknown', () => {
    // when
    const text = formatSubscriptionPrice({ price: null, currency: null, frequency: null, status: 'TRIAL' })

    // then
    expect(text).toBe('Free trial · price after trial unknown')
  })

  it('shows the price after the trial when the email stated it', () => {
    // when
    const text = formatSubscriptionPrice({ price: 15.49, currency: 'USD', frequency: 'MONTHLY', status: 'TRIAL' })

    // then
    expect(text).toBe('Free trial · then $15.49/mo')
  })

  it('only treats a price as known when amount, currency and cycle are all present', () => {
    // then
    expect(hasKnownPrice({ price: 10, currency: 'USD', frequency: 'MONTHLY' })).toBe(true)
    expect(hasKnownPrice({ price: 10, currency: null, frequency: 'MONTHLY' })).toBe(false)
    expect(hasKnownPrice({ price: null, currency: null, frequency: null })).toBe(false)
  })
})
