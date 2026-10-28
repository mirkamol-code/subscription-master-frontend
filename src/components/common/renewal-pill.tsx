import { cn, getRenewalStatus } from '@/lib/utils'

const urgencyStyles = {
  overdue: 'bg-rose-50 text-rose-700',
  today: 'bg-amber-100 text-amber-800',
  soon: 'bg-amber-50 text-amber-700',
  normal: 'bg-slate-100 text-slate-600',
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
