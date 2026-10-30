import { describe, expect, it } from 'vitest'
import { notificationSettingsSchema } from '@/schemas/notification-settings'

const settings = {
  emailEnabled: true,
  inAppEnabled: true,
  pushEnabled: false,
  daysBefore: 3,
  timeZone: 'Asia/Tashkent',
}

function firstError(values: unknown) {
  const result = notificationSettingsSchema.safeParse(values)
  return result.success ? null : result.error.issues[0]?.message
}

describe('notificationSettingsSchema', () => {
  it('accepts reminders between 1 and 30 days ahead', () => {
    // when
    const result = notificationSettingsSchema.safeParse(settings)

    // then
    expect(result.success).toBe(true)
  })

  it.each([
    [0, 'Remind at least 1 day before'],
    [31, 'Remind at most 30 days before'],
    [1.5, 'Use whole days'],
  ])('rejects %d days', (daysBefore, message) => {
    // when
    const error = firstError({ ...settings, daysBefore })

    // then
    expect(error).toBe(message)
  })

  it('needs a time zone', () => {
    // when
    const error = firstError({ ...settings, timeZone: ' ' })

    // then
    expect(error).toBe('Choose a time zone')
  })
})
