import { describe, expect, it } from 'vitest'
import { describeTrialEnd } from '@/lib/trial-end'

describe('describeTrialEnd', () => {
  it('states a confirmed trial end date', () => {
    // when
    const text = describeTrialEnd({ trialEndsOn: '2026-11-18', trialEndEstimated: false })

    // then
    expect(text).toBe('ends Nov 18, 2026')
  })

  it('says "around" when the end date was estimated from the trial length', () => {
    // when
    const text = describeTrialEnd({ trialEndsOn: '2026-11-18', trialEndEstimated: true })

    // then
    expect(text).toBe('ends around Nov 18, 2026')
  })

  it('says the end is unknown when there is no date', () => {
    // when
    const text = describeTrialEnd({ trialEndsOn: null, trialEndEstimated: false })

    // then
    expect(text).toBe('end date unknown')
  })
})
