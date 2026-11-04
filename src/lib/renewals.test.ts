import { describe, expect, it } from 'vitest'
import { isRenewing, renewalDatesInMonth } from '@/lib/renewals'
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
