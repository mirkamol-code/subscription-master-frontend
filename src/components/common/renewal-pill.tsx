import { cn, getRenewalStatus } from '@/lib/utils'

const urgencyStyles = {
  overdue: 'bg-danger/10 text-danger',
  today: 'bg-warning/20 text-warning',
  soon: 'bg-warning/10 text-warning',
  normal: 'bg-fg/[0.06] text-muted',
}

export function RenewalPill({ date, className }: { date: string; className?: string }) {
  const renewal = getRenewalStatus(date)
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
        urgencyStyles[renewal.urgency],
        className,
      )}
    >
      {renewal.text}
    </span>
  )
}
