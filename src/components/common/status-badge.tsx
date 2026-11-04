import { Badge } from '@/components/ui/badge'
import { getStatusLabel } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { SubscriptionStatus } from '@/types/api'

const neutralStyles = { badge: 'bg-fg/[0.06] text-muted', dot: 'bg-muted' }

const statusStyles: Record<SubscriptionStatus, { badge: string; dot: string }> = {
  TRIAL: { badge: 'bg-accent/10 text-accent', dot: 'bg-accent' },
  ACTIVE: { badge: 'bg-success/10 text-success', dot: 'bg-success' },
  CANCELLED: neutralStyles,
  BILLING_REQUIRED: { badge: 'bg-danger/10 text-danger', dot: 'bg-danger' },
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
