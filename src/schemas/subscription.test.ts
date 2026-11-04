import { describe, expect, it } from 'vitest'
import { subscriptionSchema } from '@/schemas/subscription'

const hetzner = {
  name: 'Hetzner',
  price: 10.09,
  currency: 'USD',
  frequency: 'MONTHLY',
  status: 'ACTIVE',
  category: 'INFRASTRUCTURE',
  startDate: '2026-10-12',
}

describe('subscriptionSchema', () => {
  it('keeps the Infrastructure category when saving', () => {
    // when
    const result = subscriptionSchema.safeParse(hetzner)

    // then
    expect(result.success && result.data.category).toBe('INFRASTRUCTURE')
  })

  it('asks the user to pick a category instead of saving an unknown one as Other', () => {
    // when
    const result = subscriptionSchema.safeParse({ ...hetzner, category: 'SPACE_TRAVEL' })

    // then
    expect(result.success).toBe(false)
  })
})
