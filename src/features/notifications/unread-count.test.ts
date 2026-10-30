import { describe, expect, it } from 'vitest'
import { formatUnreadCount } from '@/features/notifications/unread-count'

describe('formatUnreadCount', () => {
  it.each<[number, string | null]>([
    [0, null],
    [1, '1'],
    [9, '9'],
    [12, '9+'],
    [-3, null],
    [Number.NaN, null],
  ])('shows %d unread as %s', (count, expected) => {
    // when
    const badge = formatUnreadCount(count)

    // then
    expect(badge).toBe(expected)
  })
})
