import { describe, expect, it } from 'vitest'
import { describeTrialEnd } from '@/lib/trial-end'

describe('describeTrialEnd', () => {
  it('states a confirmed trial end date', () => {
    // then
    expect(describeTrialEnd({ trialEndsOn: '2026-11-18', trialEndEstimated: false })).toBe('Trial ends Nov 18, 2026')
  })

  it('says "around" when the end date was estimated from the trial length', () => {
    // then
    expect(describeTrialEnd({ trialEndsOn: '2026-11-18', trialEndEstimated: true })).toBe('Trial ends around Nov 18, 2026')
  })

  it('says the end is unknown when there is no date', () => {
    // then
    expect(describeTrialEnd({ trialEndsOn: null, trialEndEstimated: false })).toBe('Trial end date unknown')
  })
})
