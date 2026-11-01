import { describe, expect, it } from 'vitest'
import { calculateVisibleRange, getDueTone, toCalendarEvents } from '@/features/admin/due-calendar'
import type { PaymentDue } from '@/features/admin/types'

function buildEntry(overrides: Partial<PaymentDue>): PaymentDue {
  return {
    subscriptionId: 1,
    userId: 7,
    userName: 'Casey Customer',
    userEmail: 'casey@example.com',
    merchant: 'Netflix',
    merchantSlug: 'netflix',
    kind: 'PAYMENT',
    dueDate: '2026-11-12',
    amount: 65000,
    currency: 'UZS',
    amountUzs: 65000,
    status: 'ACTIVE',
    bucket: 'NEXT_3_DAYS',
    ...overrides,
  }
}

describe('getDueTone', () => {
  it('colours payments by how soon they are due', () => {
    // then
    expect(getDueTone(buildEntry({ bucket: 'OVERDUE' }))).toBe('overdue')
    expect(getDueTone(buildEntry({ bucket: 'PASSED' }))).toBe('passed')
    expect(getDueTone(buildEntry({ bucket: 'TODAY' }))).toBe('today')
    expect(getDueTone(buildEntry({ bucket: 'NEXT_3_DAYS' }))).toBe('soon')
    expect(getDueTone(buildEntry({ bucket: 'NEXT_7_DAYS' }))).toBe('week')
    expect(getDueTone(buildEntry({ bucket: 'LATER' }))).toBe('later')
  })

  it('marks an ending access separately from any payment', () => {
    // then
    expect(getDueTone(buildEntry({ kind: 'ACCESS_END', bucket: 'TODAY', amount: null, amountUzs: null }))).toBe('access')
  })
})

describe('toCalendarEvents', () => {
  it('turns a payment into an all-day event naming the merchant, amount, user and email', () => {
    // when
    const [event] = toCalendarEvents([buildEntry({})])

    // then
    expect(event.title).toMatch(/^Netflix · UZS\s65,000 · Casey Customer \(casey@example\.com\)$/)
    expect(event).toEqual({
      id: '1:PAYMENT',
      title: event.title,
      start: '2026-11-12',
      allDay: true,
      classNames: ['due-event', 'due-soon'],
      extendedProps: { userId: 7, toneLabel: 'Due in 3 days', shortLabel: '≤3d' },
    })
  })

  it('names the user once when they have no display name', () => {
    // when
    const [event] = toCalendarEvents([buildEntry({ userName: 'casey@example.com' })])

    // then
    expect(event.title).toMatch(/· casey@example\.com$/)
  })

  it('says access ends instead of showing an amount', () => {
    // when
    const [event] = toCalendarEvents([buildEntry({ kind: 'ACCESS_END', amount: null, amountUzs: null, bucket: 'NEXT_7_DAYS' })])

    // then
    expect(event.title).toBe('Netflix · access ends · Casey Customer (casey@example.com)')
    expect(event.classNames).toEqual(['due-event', 'due-access'])
    expect(event.extendedProps).toEqual({ userId: 7, toneLabel: 'Access ending', shortLabel: 'Ends' })
  })

  it('keeps foreign-currency amounts in their own currency', () => {
    // when
    const [event] = toCalendarEvents([buildEntry({ amount: 22.99, currency: 'USD', amountUzs: 295000 })])

    // then
    expect(event.title).toMatch(/^Netflix · \$22\.99 · /)
  })
})

describe('calculateVisibleRange', () => {
  it('turns the calendar’s exclusive end into the last visible day', () => {
    // when
    const range = calculateVisibleRange(new Date('2026-10-26T00:00:00Z'), new Date('2026-12-07T00:00:00Z'))

    // then
    expect(range).toEqual({ from: '2026-10-26', to: '2026-12-06' })
  })
})
