import { describe, expect, it } from 'vitest'
import { isRenewing, renewalDatesInMonth, trialEndsInMonth } from '@/lib/renewals'
import type { Subscription } from '@/types/api'

const MONTHLY: Pick<Subscription, 'status' | 'endsOn' | 'nextPaymentDate' | 'frequency'> = {
  status: 'ACTIVE',
  endsOn: null,
  nextPaymentDate: '2026-12-06',
  frequency: 'MONTHLY',
}

describe('isRenewing', () => {
  it('renews an active subscription with no scheduled end', () => {
    // then
    expect(isRenewing(MONTHLY)).toBe(true)
  })

  it('does not renew once a cancellation ends access on or before the next payment', () => {
    // then
    expect(isRenewing({ ...MONTHLY, endsOn: '2026-12-06' })).toBe(false)
    expect(isRenewing({ ...MONTHLY, endsOn: '2026-11-30' })).toBe(false)
  })

  it('still renews when access runs past the next payment', () => {
    // then
    expect(isRenewing({ ...MONTHLY, endsOn: '2027-01-15' })).toBe(true)
  })
})

describe('renewalDatesInMonth', () => {
  it('projects no charge in the month a cancelled subscription ends', () => {
    // when
    const dates = renewalDatesInMonth({ ...MONTHLY, endsOn: '2026-12-06' } as Subscription, 2026, 11)

    // then
    expect(dates).toEqual([])
  })

  it('stops projecting charges after access ends', () => {
    // when
    const dates = renewalDatesInMonth({ ...MONTHLY, endsOn: '2027-01-15' } as Subscription, 2027, 1)

    // then
    expect(dates).toEqual([])
  })
})

describe('trialEndsInMonth', () => {
  const trial = (changes: Partial<Subscription>) =>
    ({ id: 1, status: 'TRIAL', trialEndsOn: '2026-11-18', trialEndEstimated: false, ...changes }) as Subscription

  it('marks the day a trial ends, and whether that day is estimated', () => {
    // when
    const ends = trialEndsInMonth([trial({ trialEndEstimated: true })], 2026, 10)

    // then
    expect(ends).toEqual([{ date: '2026-11-18', subscription: trial({ trialEndEstimated: true }), estimated: true }])
  })

  it('leaves out other months, paid subscriptions and trials without an end date', () => {
    // when
    const ends = trialEndsInMonth(
      [trial({ trialEndsOn: '2026-12-02' }), trial({ status: 'ACTIVE' }), trial({ trialEndsOn: null })],
      2026,
      10,
    )

    // then
    expect(ends).toEqual([])
  })
})
