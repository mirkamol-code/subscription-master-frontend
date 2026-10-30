import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { getApiError, getFieldErrors } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { useUpdateNotificationSettings } from '@/features/notifications/use-notifications'
import { notificationSettingsSchema, type NotificationSettingsValues } from '@/schemas/notification-settings'
import type { NotificationSettings } from '@/types/api'

const DEVICE_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

function listTimeZones(current: string) {
  const zones = Intl.supportedValuesOf('timeZone')
  return zones.includes(current) ? zones : [current, ...zones]
}

function ChannelToggle({ label, hint, register }: { label: string; hint: string; register: UseFormRegisterReturn }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
      <input type="checkbox" className="mt-0.5 size-4 accent-teal-600" {...register} />
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="block text-[13px] text-slate-500">{hint}</span>
      </span>
    </label>
  )
}

export function NotificationSettingsForm({ settings }: { settings: NotificationSettings }) {
  const update = useUpdateNotificationSettings()
  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings,
  })
  const { errors, isDirty } = form.formState
  const timeZone = useWatch({ control: form.control, name: 'timeZone' })

  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = await update.mutateAsync(values)
      form.reset(saved)
      toast.success('Notification settings saved')
    } catch (error) {
      toast.error(getApiError(error))
      for (const [field, message] of Object.entries(getFieldErrors(error))) {
        if (field in values) form.setError(field as keyof NotificationSettingsValues, { message })
      }
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <fieldset className="space-y-1">
        <legend className="mb-2 text-sm font-medium text-slate-700">Remind me by</legend>
        <ChannelToggle label="Email" hint="Sent from your own Gmail to yourself." register={form.register('emailEnabled')} />
        <ChannelToggle label="In the app" hint="Shown under the bell." register={form.register('inAppEnabled')} />
        <ChannelToggle
          label="Browser notifications"
          hint="Turn them on for this browser below."
          register={form.register('pushEnabled')}
        />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="daysBefore" className="mb-1.5 block text-sm font-medium text-slate-700">
            Days before a payment
          </label>
          <Input
            id="daysBefore"
            type="number"
            min={1}
            max={30}
            aria-invalid={!!errors.daysBefore}
            aria-describedby={errors.daysBefore ? 'daysBefore-error' : undefined}
            {...form.register('daysBefore', { valueAsNumber: true })}
          />
          {errors.daysBefore && (
            <p id="daysBefore-error" className="mt-1.5 text-[13px] text-rose-600">
              {errors.daysBefore.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="timeZone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Time zone
          </label>
          <Select id="timeZone" aria-invalid={!!errors.timeZone} {...form.register('timeZone')}>
            {listTimeZones(settings.timeZone).map((zone) => (
              <option key={zone} value={zone}>
                {zone.replace(/_/g, ' ')}
              </option>
            ))}
          </Select>
          {timeZone !== DEVICE_TIME_ZONE && (
            <button
              type="button"
              onClick={() => form.setValue('timeZone', DEVICE_TIME_ZONE, { shouldDirty: true })}
              className="mt-1.5 text-[13px] font-medium text-teal-700 hover:underline"
            >
              Use this device’s time zone ({DEVICE_TIME_ZONE.replace(/_/g, ' ')})
            </button>
          )}
          {errors.timeZone && <p className="mt-1.5 text-[13px] text-rose-600">{errors.timeZone.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="accent" disabled={!isDirty || update.isPending}>
          {update.isPending ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}
