import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DUE_TONE_LABEL,
  describeDueAmount,
  describeDueUser,
  getDueEntryKey,
  getDueTone,
  getDueToneClass,
} from '@/features/admin/due-calendar'
import type { UpcomingPayments } from '@/features/admin/types'
import { cn, formatMoney, formatShortDate } from '@/lib/utils'

interface UpcomingPaymentsListProps {
  upcoming: UpcomingPayments | undefined
  isLoading: boolean
  error: unknown
  onRetry: () => void
}

export function UpcomingPaymentsList({ upcoming, isLoading, error, onRetry }: UpcomingPaymentsListProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Upcoming payments in the next 7 days</CardTitle>
          <CardDescription>
            {upcoming
              ? `${formatMoney(upcoming.totalUzs)} expected · ${formatMoney(upcoming.overdueTotalUzs)} overdue`
              : 'Nearest due date first'}
          </CardDescription>
        </div>
      </CardHeader>
      <div className="p-6 pt-4">
        {isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : error ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : !upcoming || upcoming.entries.length === 0 ? (
          <div className="flex items-center gap-3 text-[13px] text-muted">
            <CalendarCheck className="size-4" /> Nothing due or overdue this week.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.entries.map((entry) => {
              const tone = getDueTone(entry)
              return (
                <li key={getDueEntryKey(entry)}>
                  <Link
                    to={`/admin/users/${entry.userId}`}
                    className="flex items-center gap-3 rounded-md py-2.5 outline-none hover:bg-fg/[0.02] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span aria-hidden="true" className={cn('due-swatch shrink-0', getDueToneClass(tone))} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg">{entry.merchant}</span>
                      <span className="block truncate text-[12px] text-muted">
                        {describeDueUser(entry)}
                      </span>
                      <span className="block text-[12px] font-medium text-fg">
                        {DUE_TONE_LABEL[tone]}
                      </span>
                    </span>
                    <span className="shrink-0 text-right tabular-nums">
                      <span className="block text-sm font-medium text-fg">{describeDueAmount(entry)}</span>
                      <span className="block text-[12px] text-muted">{formatShortDate(entry.dueDate)}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}
