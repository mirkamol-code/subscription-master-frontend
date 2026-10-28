import { Pause, Play, type LucideIcon } from 'lucide-react'
import type { SubscriptionStatus } from '@/types/api'

export type StatusAction = 'pause' | 'resume'

interface StatusActionUi {
  label: string
  pendingLabel: string
  icon: LucideIcon
}

/** The one status change each status allows; cancelled subscriptions can't be paused or resumed. */
export const STATUS_ACTION: Record<SubscriptionStatus, StatusAction | null> = {
  ACTIVE: 'pause',
  PAUSED: 'resume',
  CANCELLED: null,
}

export const STATUS_ACTION_UI: Record<StatusAction, StatusActionUi> = {
  pause: { label: 'Pause', pendingLabel: 'Pausing…', icon: Pause },
  resume: { label: 'Resume', pendingLabel: 'Resuming…', icon: Play },
}
