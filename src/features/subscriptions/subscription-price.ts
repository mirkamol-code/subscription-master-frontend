import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatMoney } from '@/lib/utils'
import type { Currency, Frequency, Subscription } from '@/types/api'

type PricedFields = Pick<Subscription, 'price' | 'currency' | 'frequency'>

export type KnownPrice<T extends PricedFields> = T & { price: number; currency: Currency; frequency: Frequency }

export function hasKnownPrice<T extends PricedFields>(sub: T): sub is KnownPrice<T> {
  return sub.price !== null && sub.currency !== null && sub.frequency !== null
}

export function formatSubscriptionPrice(sub: PricedFields & Pick<Subscription, 'status'>): string {
  const price = hasKnownPrice(sub) ? `${formatMoney(sub.price, sub.currency)}${FREQUENCY_SUFFIX[sub.frequency]}` : null
  if (sub.status === 'TRIAL') return price ? `Free trial · then ${price}` : 'Free trial · price after trial unknown'
  return price ?? '—'
}
