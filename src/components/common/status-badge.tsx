import { Badge } from '@/components/ui/badge'
import { getStatusLabel } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { SubscriptionStatus } from '@/types/api'

const neutralStyles = { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' }

const statusStyles: Record<SubscriptionStatus, { badge: string; dot: string }> = {
  ACTIVE: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: neutralStyles,
  BILLING_REQUIRED: { badge: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
}

export function StatusBadge({
  status,
  className,
}: {
  status: SubscriptionStatus
  className?: string
}) {
  const styles = statusStyles[status] ?? neutralStyles

  return (
    <Badge className={cn(styles.badge, className)}>
      <span className={cn('size-1.5 rounded-full', styles.dot)} />
      {getStatusLabel(status)}
    </Badge>
  )
}
