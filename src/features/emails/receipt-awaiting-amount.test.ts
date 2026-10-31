import { describe, expect, it } from 'vitest'
import { findReceiptAwaitingAmount } from '@/features/emails/receipt-awaiting-amount'
import type { BillingEmail } from '@/types/api'

function billingEmail(overrides: Partial<BillingEmail>): BillingEmail {
  return {
    id: 1,
    gmailMessageId: 'm1',
    kind: 'RECEIPT',
    sender: 'OpenAI <noreply@tm.openai.com>',
    subject: 'Your ChatGPT Plus receipt',
    receivedAt: '2026-10-05T03:00:00Z',
    confidence: 'HIGH',
    amountUnreadable: false,
    attachments: [],
    ...overrides,
  }
}

describe('findReceiptAwaitingAmount', () => {
  it('picks the newest receipt whose amount could not be read', () => {
    // given
    const emails = [
      billingEmail({ id: 1, receivedAt: '2026-10-06T03:00:00Z', amountUnreadable: true }),
      billingEmail({ id: 2, receivedAt: '2026-11-06T03:00:00Z', amountUnreadable: true }),
      billingEmail({ id: 3, receivedAt: '2026-12-06T03:00:00Z' }),
    ]

    // when
    const receipt = findReceiptAwaitingAmount(emails)

    // then
    expect(receipt?.id).toBe(2)
  })

  it('finds nothing when every receipt is priced', () => {
    // when
    const receipt = findReceiptAwaitingAmount([billingEmail({ id: 1 }), billingEmail({ id: 2, kind: 'CANCELLATION' })])

    // then
    expect(receipt).toBeUndefined()
  })

  it('finds nothing before the emails have loaded', () => {
    // when
    const receipt = findReceiptAwaitingAmount(undefined)

    // then
    expect(receipt).toBeUndefined()
  })

  it('compares receipt times, not their text, when offsets differ', () => {
    // given
    const emails = [
      billingEmail({ id: 1, receivedAt: '2026-11-06T08:00:00+05:00', amountUnreadable: true }),
      billingEmail({ id: 2, receivedAt: '2026-11-06T03:30:00Z', amountUnreadable: true }),
    ]

    // when
    const receipt = findReceiptAwaitingAmount(emails)

    // then
    expect(receipt?.id).toBe(2)
  })
})
