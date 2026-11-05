import { formatDate } from '@/lib/utils'
import type { Subscription } from '@/types/api'

export function describeTrialEnd(sub: Pick<Subscription, 'trialEndsOn' | 'trialEndEstimated'>): string {
  if (!sub.trialEndsOn) return 'end date unknown'
  return `ends ${sub.trialEndEstimated ? 'around ' : ''}${formatDate(sub.trialEndsOn)}`
}
