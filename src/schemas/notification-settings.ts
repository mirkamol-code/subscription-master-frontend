import { z } from 'zod'

export const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  daysBefore: z
    .number({ error: 'Enter a number of days' })
    .int('Use whole days')
    .min(1, 'Remind at least 1 day before')
    .max(30, 'Remind at most 30 days before'),
  timeZone: z.string().trim().min(1, 'Choose a time zone'),
})

export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>
