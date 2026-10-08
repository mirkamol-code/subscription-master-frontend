import { Badge } from '@/components/ui/badge'
import { humanize } from '@/lib/utils'
import type { SubscriptionStatus } from '@/types/api'

const styles: Record<SubscriptionStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10',
  PAUSED: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-1 ring-slate-600/10',
}

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return <Badge className={styles[status]}>{humanize(status)}</Badge>
}
