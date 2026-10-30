import type { Tone } from '@/lib/tone'
import { formatDate, toLocalIsoDate } from '@/lib/utils'
import type { GmailSyncStatus } from '@/types/api'

export interface SyncDescription {
  label: string
  percent: number | null
  tone: Tone
  isRunning: boolean
  shouldPoll: boolean
  actionLabel?: string
}

function describeRunningSync({ processed, total }: GmailSyncStatus): SyncDescription {
  const hasCount = total > 0
  return {
    label: hasCount ? `Reading your inbox… ${processed} of ${total} emails` : 'Reading your inbox…',
    percent: hasCount ? Math.min(100, Math.round((processed / total) * 100)) : null,
    tone: 'neutral',
    isRunning: true,
    shouldPoll: true,
  }
}

function describeLastSync(lastSyncedAt: string | null) {
  return lastSyncedAt ? `Last synced ${formatDate(toLocalIsoDate(lastSyncedAt))}` : 'Not synced yet'
}

function describeFinishedSync(
  label: string,
  tone: Tone,
  actionLabel?: string,
): SyncDescription {
  return { label, percent: null, tone, isRunning: false, shouldPoll: false, ...(actionLabel && { actionLabel }) }
}

export function describeSync(status: GmailSyncStatus): SyncDescription {
  if (status.state === 'RUNNING') return describeRunningSync(status)
  if (status.error === 'RECONNECT_REQUIRED') {
    return describeFinishedSync('Gmail stopped giving us access', 'danger', 'Reconnect Gmail')
  }
  if (status.state === 'FAILED') return describeFinishedSync('Sync didn’t finish. Try again', 'danger')
  const lastSync = describeLastSync(status.lastSyncedAt)
  if (status.error === 'SOME_EMAILS_FAILED') {
    return describeFinishedSync(`${lastSync}. Some emails couldn’t be read`, 'warning')
  }
  return describeFinishedSync(lastSync, 'positive')
}
