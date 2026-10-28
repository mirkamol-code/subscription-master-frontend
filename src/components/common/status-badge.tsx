import { Badge } from '@/components/ui/badge'
import { STATUS_LABEL } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { SubscriptionStatus } from '@/types/api'

const statusStyles: Record<SubscriptionStatus, { badge: string; dot: string }> = {
  ACTIVE: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  PAUSED: { badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  CANCELLED: { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
}

export function StatusBadge({
  status,
  className,
}: {
  status: SubscriptionStatus
  className?: string
}) {
  const styles = statusStyles[status] ?? statusStyles.ACTIVE

  return (
    <Badge className={cn(styles.badge, className)}>
      <span className={cn('size-1.5 rounded-full', styles.dot)} />
      {STATUS_LABEL[status] ?? status}
    </Badge>
  )
}
