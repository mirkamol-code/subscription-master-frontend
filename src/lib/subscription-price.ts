import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatMoney } from '@/lib/utils'
import type { Currency, Frequency, Subscription } from '@/types/api'

type PricedFields = Pick<Subscription, 'price' | 'currency' | 'frequency'>

type KnownPrice<T extends PricedFields> = T & { price: number; currency: Currency; frequency: Frequency }

export interface TrialPrice {
  headline: string
  caption: string | null
}

const TRIAL_HEADLINE = 'Free'

export function hasKnownPrice<T extends PricedFields>(sub: T): sub is KnownPrice<T> {
  return sub.price !== null && sub.currency !== null && sub.frequency !== null
}

function formatKnownPrice(sub: PricedFields): string | null {
  return hasKnownPrice(sub) ? `${formatMoney(sub.price, sub.currency)}${FREQUENCY_SUFFIX[sub.frequency]}` : null
}

export function describeTrialPrice(sub: PricedFields): TrialPrice {
  const later = formatKnownPrice(sub)
  return { headline: TRIAL_HEADLINE, caption: later ? `then ${later}` : null }
}

export function formatSubscriptionPrice(sub: PricedFields & Pick<Subscription, 'status'>): string {
  if (sub.status !== 'TRIAL') return formatKnownPrice(sub) ?? '—'
  const { headline, caption } = describeTrialPrice(sub)
  return caption ? `${headline}, ${caption}` : headline
}
