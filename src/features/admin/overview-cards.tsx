import { CalendarClock, LogIn, UserPlus, Users, type LucideIcon } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { useAdminOverview } from '@/hooks/use-admin'
import { formatMoney } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  detail: string
  icon: LucideIcon
}

function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        <Icon className="size-4 text-muted" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-fg tabular-nums">{value}</p>
      <p className="mt-1 text-[13px] text-muted">{detail}</p>
    </Card>
  )
}

export function OverviewCards() {
  const query = useAdminOverview()

  if (query.isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-32 rounded-2xl" />
        ))}
      </div>
    )
  if (isForbiddenOrMissing(query.error)) return null
  if (query.isError || !query.data) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />

  const overview = query.data
  const dueTotal =
    overview.paymentsDueNext7DaysTotalUzs === null
      ? 'Total unavailable: no exchange rates'
      : `${formatMoney(overview.paymentsDueNext7DaysTotalUzs)} expected`

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="New signups"
        value={String(overview.signupsToday)}
        detail={`Today · ${overview.signupsLast7Days} in 7 days · ${overview.signupsLast30Days} in 30 days`}
        icon={UserPlus}
      />
      <StatCard
        label="Active subscribers"
        value={String(overview.activeSubscribers)}
        detail="Users with at least one active subscription"
        icon={Users}
      />
      <StatCard
        label="Logins"
        value={String(overview.loginsLast24Hours)}
        detail="In the last 24 hours"
        icon={LogIn}
      />
      <StatCard
        label="Payments due"
        value={String(overview.paymentsDueNext7Days)}
        detail={`Next 7 days · ${dueTotal}`}
        icon={CalendarClock}
      />
    </div>
  )
}
