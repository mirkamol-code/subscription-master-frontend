import { BellRing } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { BrowserPushState } from '@/features/push/browser-push'
import { useBrowserPush } from '@/features/push/use-browser-push'

const STATE_TEXT: Record<BrowserPushState, string> = {
  unsupported: 'This browser can’t show notifications. On iPhone, add the app to your home screen first.',
  blocked: 'Notifications are blocked for this site. Allow them in your browser’s site settings, then reload.',
  off: 'Get payment reminders even when the app is closed.',
  on: 'This browser will show payment reminders.',
}

export function BrowserPushCard() {
  const push = useBrowserPush()

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <BellRing className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">Browser notifications</p>
            {push.state.isLoading ? (
              <Skeleton className="mt-1 h-4 w-56" />
            ) : push.state.data ? (
              <p className="text-sm text-slate-500">{STATE_TEXT[push.state.data]}</p>
            ) : (
              <ErrorState bare error={push.state.error} onRetry={() => void push.state.refetch()} />
            )}
          </div>
        </div>
        {push.state.data === 'off' && (
          <Button variant="accent" size="sm" onClick={push.turnOn} disabled={push.isChanging}>
            {push.isChanging ? 'Turning on…' : 'Turn on'}
          </Button>
        )}
        {push.state.data === 'on' && (
          <Button variant="outline" size="sm" onClick={push.turnOff} disabled={push.isChanging}>
            {push.isChanging ? 'Turning off…' : 'Turn off'}
          </Button>
        )}
      </div>
    </Card>
  )
}
