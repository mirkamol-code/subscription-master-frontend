import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DangerZoneCard } from '@/features/account/danger-zone-card'
import { NotificationSettingsForm } from '@/features/notifications/notification-settings-form'
import { useNotificationSettings } from '@/features/notifications/use-notifications'

function NotificationSettingsCard() {
  const settings = useNotificationSettings()

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Payment reminders</CardTitle>
          <CardDescription>How and when we remind you before money leaves your account.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {settings.isLoading ? (
          <Skeleton className="h-64" />
        ) : !settings.data ? (
          <ErrorState bare error={settings.error} onRetry={() => void settings.refetch()} />
        ) : (
          <NotificationSettingsForm settings={settings.data} />
        )}
      </CardContent>
    </Card>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Reminders, browser notifications and your account." />
      <NotificationSettingsCard />
      <DangerZoneCard />
    </div>
  )
}
