import { describe, expect, it } from 'vitest'
import { describeTrialPrice, formatSubscriptionPrice, hasKnownPrice } from '@/lib/subscription-price'

describe('subscription price', () => {
  it('formats a known price with its cycle', () => {
    // when
    const text = formatSubscriptionPrice({ price: 22.99, currency: 'USD', frequency: 'MONTHLY', status: 'ACTIVE' })

    // then
    expect(text).toBe('$22.99/mo')
  })

  it('shows only "Free" for a trial whose later price is unknown', () => {
    // when
    const text = formatSubscriptionPrice({ price: null, currency: null, frequency: null, status: 'TRIAL' })

    // then
    expect(text).toBe('Free')
  })

  it('shows the price after the trial when the email stated it', () => {
    // when
    const text = formatSubscriptionPrice({ price: 15.49, currency: 'USD', frequency: 'MONTHLY', status: 'TRIAL' })

    // then
    expect(text).toBe('Free · then $15.49/mo')
  })

  it('splits a trial price into a headline and the later price when it is known', () => {
    // when
    const price = describeTrialPrice({ price: 15.49, currency: 'USD', frequency: 'MONTHLY' })

    // then
    expect(price).toEqual({ headline: 'Free', laterPrice: '$15.49/mo' })
  })

  it('has no later price and never shows $0 when it is unknown', () => {
    // when
    const price = describeTrialPrice({ price: null, currency: null, frequency: null })

    // then
    expect(price).toEqual({ headline: 'Free', laterPrice: null })
  })

  it('only treats a price as known when amount, currency and cycle are all present', () => {
    // then
    expect(hasKnownPrice({ price: 10, currency: 'USD', frequency: 'MONTHLY' })).toBe(true)
    expect(hasKnownPrice({ price: 10, currency: null, frequency: 'MONTHLY' })).toBe(false)
    expect(hasKnownPrice({ price: null, currency: null, frequency: null })).toBe(false)
  })
})
