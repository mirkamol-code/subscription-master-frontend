import { describe, expect, it } from 'vitest'
import { describeBilling } from '@/features/subscriptions/billing-description'

describe('describeBilling', () => {
  it('describes an Apple-billed subscription with its plan and card', () => {
    // when
    const billing = describeBilling({
      planName: 'Telegram Premium',
      billingPlatform: 'APPLE',
      paymentMethod: { type: 'CARD', cardBrand: 'Visa', cardLast4: '4242' },
    })

    // then
    expect(billing).toEqual({ plan: 'Telegram Premium', billedThrough: 'Billed through Apple', paymentMethod: 'Visa •••• 4242' })
  })

  it('names a card without a brand by its last four digits', () => {
    // when
    const billing = describeBilling({
      planName: null,
      billingPlatform: null,
      paymentMethod: { type: 'CARD', cardBrand: null, cardLast4: '4242' },
    })

    // then
    expect(billing.paymentMethod).toBe('Card •••• 4242')
  })

  it('says only Card when the email named no brand or digits', () => {
    // when
    const billing = describeBilling({
      planName: null,
      billingPlatform: null,
      paymentMethod: { type: 'CARD', cardBrand: null, cardLast4: null },
    })

    // then
    expect(billing).toEqual({ plan: null, billedThrough: null, paymentMethod: 'Card' })
  })

  it('names PayPal and Google Play', () => {
    // when
    const billing = describeBilling({
      planName: null,
      billingPlatform: 'GOOGLE_PLAY',
      paymentMethod: { type: 'PAYPAL', cardBrand: null, cardLast4: null },
    })

    // then
    expect(billing).toEqual({ plan: null, billedThrough: 'Billed through Google Play', paymentMethod: 'PayPal' })
  })

  it('shows nothing when no billing details were found', () => {
    // when
    const billing = describeBilling({ planName: null, billingPlatform: null, paymentMethod: null })

    // then
    expect(billing).toEqual({ plan: null, billedThrough: null, paymentMethod: null })
  })
})
