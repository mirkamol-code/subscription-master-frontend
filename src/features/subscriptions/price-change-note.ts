import { formatDate, formatMoney } from '@/lib/utils'
import type { PriceChange } from '@/types/api'

export function describePriceChange(change: PriceChange | null | undefined): string | null {
  if (!change) return null
  const isPast = change.source === 'INVOICE'
  const when = change.effectiveOn ? ` on ${formatDate(change.effectiveOn)}` : ''
  if (change.oldAmount !== null && change.newAmount !== null && change.currency) {
    const verb = isPast ? 'changed' : 'changes'
    return `Price ${verb} from ${formatMoney(change.oldAmount, change.currency)} to ${formatMoney(change.newAmount, change.currency)}${when}.`
  }
  if (change.effectiveOn) return `A price change was announced, starting${when}. Check the email for details.`
  return null
}
