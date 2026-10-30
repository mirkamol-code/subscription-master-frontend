import { RenewalPill } from '@/components/common/renewal-pill'
import { StatusBadge } from '@/components/common/status-badge'
import { isRenewing } from '@/lib/renewals'
import type { Subscription } from '@/types/api'

/** Active subscriptions show when they renew; the rest show their status instead. */
export function SubscriptionRenewal({ item }: { item: Subscription }) {
  return isRenewing(item) ? (
    <RenewalPill date={item.nextPaymentDate} />
  ) : (
    <StatusBadge status={item.status} />
  )
}
