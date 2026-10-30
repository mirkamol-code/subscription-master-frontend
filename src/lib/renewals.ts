import type { Subscription } from '@/types/api'
import { parseLocalDate, toIsoDate } from '@/lib/utils'

/** Only active subscriptions renew; cancelled and billing-required ones have no upcoming payment. */
export function isRenewing(sub: Pick<Subscription, 'status'>): boolean {
  return sub.status === 'ACTIVE'
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** The k-th renewal after `anchor`, keeping the billing day (clamped to short months). */
function nthRenewal(anchor: Date, frequency: Subscription['frequency'], k: number): Date {
  if (frequency === 'WEEKLY') {
    return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + 7 * k)
  }
  const monthsAhead = frequency === 'MONTHLY' ? k : 12 * k
  const year = anchor.getFullYear() + Math.floor((anchor.getMonth() + monthsAhead) / 12)
  const month = (anchor.getMonth() + monthsAhead) % 12
  return new Date(year, month, Math.min(anchor.getDate(), daysInMonth(year, month)))
}

/**
 * Projected charge dates for an active subscription within the given month,
 * starting from its next payment date. Past charges are not reconstructed.
 */
export function renewalDatesInMonth(sub: Subscription, year: number, month: number): string[] {
  if (!isRenewing(sub) || !sub.nextPaymentDate) return []

  const anchor = parseLocalDate(sub.nextPaymentDate)
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  if (Number.isNaN(anchor.getTime()) || anchor > monthEnd) return []

  const dates: string[] = []
  for (let k = 0; ; k++) {
    const date = nthRenewal(anchor, sub.frequency, k)
    if (date > monthEnd) break
    if (date >= monthStart) dates.push(toIsoDate(date))
  }
  return dates
}
