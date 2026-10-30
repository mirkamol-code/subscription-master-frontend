import { describe, expect, it } from 'vitest'
import { getStatusChoices } from '@/features/subscriptions/status-choices'
import type { SubscriptionStatus } from '@/types/api'

describe('getStatusChoices', () => {
  it('lets the User cancel an Active subscription', () => {
    // when
    const choices = getStatusChoices('ACTIVE')

    // then
    expect(choices).toEqual(['CANCELLED'])
  })

  it('lets the User make a Cancelled subscription Active again', () => {
    // when
    const choices = getStatusChoices('CANCELLED')

    // then
    expect(choices).toEqual(['ACTIVE'])
  })

  it('lets the User settle a Billing required subscription either way', () => {
    // when
    const choices = getStatusChoices('BILLING_REQUIRED')

    // then
    expect(choices).toEqual(['ACTIVE', 'CANCELLED'])
  })

  it('offers Active and Cancelled for a status the backend adds later', () => {
    // given
    const unknownStatus = 'SUSPENDED' as SubscriptionStatus

    // when
    const choices = getStatusChoices(unknownStatus)

    // then
    expect(choices).toEqual(['ACTIVE', 'CANCELLED'])
  })
})
