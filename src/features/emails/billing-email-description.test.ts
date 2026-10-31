import { describe, expect, it } from 'vitest'
import { describeBillingEmail } from '@/features/emails/billing-email-description'
import type { BillingEmail } from '@/types/api'

function billingEmail(overrides: Partial<BillingEmail>): BillingEmail {
  return {
    id: 1,
    gmailMessageId: 'm1',
    kind: 'RECEIPT',
    sender: 'info@account.netflix.com',
    subject: 'Your Netflix receipt',
    receivedAt: '2026-11-05T08:00:00Z',
    confidence: 'HIGH',
    amountUnreadable: false,
    attachments: [],
    ...overrides,
  }
}

describe('describeBillingEmail', () => {
  it.each<[BillingEmail['kind'], string, string]>([
    ['RECEIPT', 'Receipt', 'positive'],
    ['CANCELLATION', 'Cancellation', 'neutral'],
    ['PAYMENT_FAILED', 'Payment failed', 'danger'],
    ['REFUND' as BillingEmail['kind'], 'Refund', 'neutral'],
  ])('labels a %s email', (kind, kindLabel, tone) => {
    // when
    const description = describeBillingEmail(billingEmail({ kind }))

    // then
    expect(description).toMatchObject({ kindLabel, tone })
  })

  it('asks for the amount when a receipt could not be priced', () => {
    // when
    const description = describeBillingEmail(billingEmail({ amountUnreadable: true }))

    // then
    expect(description.amountNote).toBe('Amount unreadable. Enter it to record this payment.')
  })

  it('has no amount note once the receipt is priced', () => {
    // when
    const description = describeBillingEmail(billingEmail({ amountUnreadable: false }))

    // then
    expect(description.amountNote).toBeUndefined()
  })

  it('warns when the email was matched to the subscription with low confidence', () => {
    // when
    const description = describeBillingEmail(billingEmail({ confidence: 'LOW' }))

    // then
    expect(description.confidenceNote).toBe('We’re not sure this email belongs here')
  })

  it('says nothing about confidence for a confident match', () => {
    // when
    const description = describeBillingEmail(billingEmail({ confidence: 'HIGH' }))

    // then
    expect(description.confidenceNote).toBeUndefined()
  })

  it('still reads well without a subject or sender', () => {
    // when
    const description = describeBillingEmail(billingEmail({ subject: ' ', sender: null }))

    // then
    expect(description).toMatchObject({ title: '(no subject)', from: 'Unknown sender' })
  })
})
