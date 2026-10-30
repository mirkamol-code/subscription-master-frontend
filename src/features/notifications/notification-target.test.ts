import { describe, expect, it } from 'vitest'
import { getNotificationTarget } from '@/features/notifications/notification-target'

const APP_ORIGIN = 'https://subscriptionmaster.app'

describe('getNotificationTarget', () => {
  it('opens the subscription the notification is about', () => {
    // when
    const target = getNotificationTarget({ subscriptionId: 42, link: null }, APP_ORIGIN)

    // then
    expect(target).toBe('/subscriptions/42')
  })

  it.each([
    ['https://subscriptionmaster.app/reports?year=2026#top', '/reports?year=2026#top'],
    ['/subscriptions?view=calendar', '/subscriptions?view=calendar'],
  ])('turns the in-app link %s into a router path', (link, expected) => {
    // when
    const target = getNotificationTarget({ subscriptionId: null, link }, APP_ORIGIN)

    // then
    expect(target).toBe(expected)
  })

  it.each([
    'https://evil.example/subscriptions/42',
    '//evil.example/subscriptions/42',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'not a url at all',
    '',
  ])('refuses to follow %s', (link) => {
    // when
    const target = getNotificationTarget({ subscriptionId: null, link }, APP_ORIGIN)

    // then
    expect(target).toBeNull()
  })

  it('has nowhere to go without a subscription or link', () => {
    // when
    const target = getNotificationTarget({ subscriptionId: null, link: null }, APP_ORIGIN)

    // then
    expect(target).toBeNull()
  })
})
