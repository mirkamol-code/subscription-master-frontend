import { describe, expect, it } from 'vitest'
import { describeStatusChange } from '@/features/subscriptions/status-change-description'
import type { StatusChange } from '@/types/api'

const netflix = { name: 'Netflix' }

function startOfLocalDay(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day).toISOString()
}

function statusChange(overrides: Partial<StatusChange>): StatusChange {
  return {
    id: 1,
    fromStatus: 'ACTIVE',
    toStatus: 'ACTIVE',
    reason: 'USER',
    source: 'USER',
    effectiveAt: '2026-11-08T09:00:00Z',
    endsOn: null,
    billingEmailId: null,
    gmailMessageId: null,
    emailSender: null,
    emailSubject: null,
    emailReceivedAt: null,
    ...overrides,
  }
}

describe('describeStatusChange', () => {
  it('names the source email by its subject and sender', () => {
    // given
    const change = statusChange({
      toStatus: 'CANCELLED',
      reason: 'EMAIL_CANCELLATION',
      source: 'EMAIL',
      billingEmailId: 7,
      emailSender: 'OpenAI <noreply@tm.openai.com>',
      emailSubject: 'Your ChatGPT Plus subscription has been canceled',
    })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description.detail).toBe('“Your ChatGPT Plus subscription has been canceled” from OpenAI <noreply@tm.openai.com>')
  })

  it('reports a failed payment from a billing email', () => {
    // given
    const change = statusChange({
      toStatus: 'BILLING_REQUIRED',
      reason: 'EMAIL_PAYMENT_FAILED',
      source: 'EMAIL',
      emailSender: 'info@account.netflix.com',
    })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description).toEqual({
      text: 'Netflix payment failed',
      detail: 'Email from info@account.netflix.com',
      tone: 'danger',
    })
  })

  it('warns softly when no receipt arrived by the expected date', () => {
    // given
    const change = statusChange({
      toStatus: 'BILLING_REQUIRED',
      reason: 'OVERDUE',
      source: 'SYSTEM',
      effectiveAt: startOfLocalDay(2026, 10, 5),
    })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description).toEqual({
      text: 'We didn’t find a receipt for Netflix, expected Nov 5. Check your payment',
      tone: 'warning',
    })
  })

  it('takes the expected date from the overdue change, not the moved-on next payment', () => {
    // given
    const change = statusChange({
      toStatus: 'BILLING_REQUIRED',
      reason: 'OVERDUE',
      source: 'SYSTEM',
      effectiveAt: startOfLocalDay(2026, 7, 10),
    })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description.text).toBe('We didn’t find a receipt for Netflix, expected Aug 10. Check your payment')
  })

  it('still reads well when the billing email has no sender', () => {
    // given
    const change = statusChange({
      toStatus: 'BILLING_REQUIRED',
      reason: 'EMAIL_PAYMENT_FAILED',
      source: 'EMAIL',
      emailSender: null,
    })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description).toEqual({ text: 'Netflix payment failed', tone: 'danger' })
  })

  it.each<[string, Partial<StatusChange>, string, string]>([
    ['a receipt', { reason: 'EMAIL_RECEIPT', source: 'EMAIL' }, 'Receipt found, Netflix is active', 'positive'],
    [
      'a cancellation with an end date',
      { toStatus: 'CANCELLED', reason: 'EMAIL_CANCELLATION', source: 'EMAIL', endsOn: '2026-12-01' },
      'Netflix was cancelled. Access ends Dec 1',
      'neutral',
    ],
    [
      'a cancellation without an end date',
      { toStatus: 'CANCELLED', reason: 'EMAIL_CANCELLATION', source: 'EMAIL' },
      'Netflix was cancelled',
      'neutral',
    ],
    [
      'a scheduled cancellation',
      { reason: 'CANCELLATION_SCHEDULED', source: 'EMAIL', endsOn: '2026-12-01' },
      'Netflix is set to end on Dec 1',
      'neutral',
    ],
    [
      'the scheduled end',
      { toStatus: 'CANCELLED', reason: 'SCHEDULED_END', source: 'SYSTEM' },
      'Netflix ended as scheduled',
      'neutral',
    ],
    ['the User’s own change', { toStatus: 'CANCELLED', reason: 'USER' }, 'You marked Netflix as Cancelled', 'neutral'],
  ])('describes %s', (_, overrides, text, tone) => {
    // given
    const change = statusChange(overrides)

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description).toMatchObject({ text, tone })
  })

  it('falls back to a plain line for a reason the backend adds later', () => {
    // given
    const change = statusChange({ toStatus: 'CANCELLED', reason: 'REFUND_ISSUED' as StatusChange['reason'] })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description).toEqual({ text: 'Netflix changed to Cancelled', tone: 'neutral' })
  })

  it('gives a readable name to a status the backend adds later', () => {
    // given
    const change = statusChange({ toStatus: 'ON_HOLD' as StatusChange['toStatus'], reason: 'USER' })

    // when
    const description = describeStatusChange(change, netflix)

    // then
    expect(description.text).toBe('You marked Netflix as On hold')
  })
})
