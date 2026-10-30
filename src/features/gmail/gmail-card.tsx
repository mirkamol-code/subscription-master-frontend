import { Loader2, Mail, RefreshCw } from 'lucide-react'
import { GOOGLE_LOGIN_URL } from '@/api/endpoints/auth'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGmailCard } from '@/features/gmail/use-gmail-card'
import type { Tone } from '@/lib/tone'
import { cn } from '@/lib/utils'

const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-slate-500',
  positive: 'text-slate-500',
  warning: 'text-amber-700',
  danger: 'text-rose-600',
}

function GoogleLink({ label }: { label: string }) {
  return (
    <Button asChild variant="accent" size="sm">
      <a href={GOOGLE_LOGIN_URL}>{label}</a>
    </Button>
  )
}

export function GmailCard() {
  const { connection, connectionView, syncStatus, sync, startSync, isSyncing } = useGmailCard()

  if (connection.isLoading) return <Skeleton className="h-24 rounded-2xl" />
  if (!connectionView) {
    return (
      <Card className="p-4">
        <ErrorState bare error={connection.error} onRetry={() => void connection.refetch()} />
      </Card>
    )
  }

  const actionLabel = connectionView.actionLabel ?? sync?.actionLabel

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Mail className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{connectionView.title}</p>
            <p className="truncate text-sm text-slate-500">{connectionView.description}</p>
          </div>
        </div>
        {actionLabel ? (
          <GoogleLink label={actionLabel} />
        ) : (
          <Button variant="outline" size="sm" onClick={startSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
            {isSyncing ? 'Syncing…' : 'Sync now'}
          </Button>
        )}
      </div>

      {connectionView.canSync && syncStatus.isLoading && <Skeleton className="mt-4 h-4 w-48" />}

      {connectionView.canSync && syncStatus.isError && (
        <div className="mt-4">
          <ErrorState bare error={syncStatus.error} onRetry={() => void syncStatus.refetch()} />
        </div>
      )}

      {connectionView.canSync && sync && (
        <div className="mt-4" aria-live="polite">
          {sync.percent !== null && (
            <div
              className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={sync.percent}
              aria-label="Sync progress"
            >
              <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${sync.percent}%` }} />
            </div>
          )}
          <p className={cn('text-sm', TONE_TEXT[sync.tone])}>{sync.label}</p>
        </div>
      )}
    </Card>
  )
}
