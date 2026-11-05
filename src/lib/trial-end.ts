import { formatDate } from '@/lib/utils'
import type { Subscription } from '@/types/api'

export function describeTrialEnd(sub: Pick<Subscription, 'trialEndsOn' | 'trialEndEstimated'>): string {
  if (!sub.trialEndsOn) return 'Trial end date unknown'
  return `Trial ends ${sub.trialEndEstimated ? 'around ' : ''}${formatDate(sub.trialEndsOn)}`
}
