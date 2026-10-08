import type { ElementType } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock, CircleDollarSign, CreditCard, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlyDynamics, useSummary } from '@/hooks/use-statistics'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import { formatDate, formatMoney, humanize } from '@/lib/utils'

export function DashboardPage() {
  const summary = useSummary()
  const dynamics = useMonthlyDynamics(6)
  const upcoming = useSubscriptions({ status: 'ACTIVE', page: 0, size: 5, sort: ['nextPaymentDate,ASC'] })
  const maxCost = Math.max(...(dynamics.data?.map((item) => item.costUzs) ?? [0]), 1)

  if (summary.isError && dynamics.isError && upcoming.isError)
    return (
      <ErrorState
        error={summary.error}
        onRetry={() => {
          void summary.refetch()
          void dynamics.refetch()
          void upcoming.refetch()
        }}
      />
    )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">Financial snapshot</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Your subscriptions at a glance
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live totals and upcoming renewals from your account.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link to="/subscriptions/new">
            <Plus className="size-4" /> Add subscription
          </Link>
        </Button>
      </div>

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-3" aria-label="Spending summary">
        <MetricCard
          label="Monthly spend"
          icon={CircleDollarSign}
          loading={summary.isLoading}
          value={
            summary.data
              ? formatMoney(summary.data.monthlyTotalUzs, summary.data.baseCurrency || 'UZS')
              : '—'
          }
          note={`Normalized in ${summary.data?.baseCurrency || 'UZS'}`}
        />
        <MetricCard
          label="Active subscriptions"
          icon={CreditCard}
          loading={upcoming.isLoading}
          value={upcoming.data ? String(upcoming.data.totalElements) : '—'}
          note="Currently renewing"
        />
        <MetricCard
          label="Highest monthly cost"
          icon={Sparkles}
          loading={summary.isLoading}
          value={
            summary.data?.mostExpensive
              ? formatMoney(
                  summary.data.mostExpensive.monthlyCostUzs,
                  summary.data.baseCurrency || 'UZS',
                )
              : '—'
          }
          note={summary.data?.mostExpensive?.subscriptionName || 'No subscription yet'}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Monthly spending bar chart */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-950">Monthly spending</h3>
              <p className="mt-1 text-sm text-slate-500">
                Normalized recurring cost over the last six months
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {dynamics.isLoading ? (
              <Skeleton className="h-64" />
            ) : dynamics.isError ? (
              <ErrorState error={dynamics.error} onRetry={() => void dynamics.refetch()} />
            ) : dynamics.data?.length ? (
              <div className="flex h-64 items-end gap-3 border-b border-slate-200 pt-5">
                {dynamics.data.map((item) => (
                  <div key={item.month} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                    <div className="group relative flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-teal-500 transition-colors hover:bg-teal-600"
                        style={{ height: `${Math.max((item.costUzs / maxCost) * 100, 3)}%` }}
                      >
                        <span className="sr-only">{formatMoney(item.costUzs, 'UZS')}</span>
                      </div>
                    </div>
                    <span className="truncate text-center text-xs text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No trend data yet"
                description="Monthly spending will appear after subscriptions are added."
              />
            )}
          </CardContent>
        </Card>

        {/* Spend by category */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-950">Spend by category</h3>
            <p className="mt-1 text-sm text-slate-500">
              Monthly cost in {summary.data?.baseCurrency || 'UZS'}
            </p>
          </CardHeader>
          <CardContent>
            {summary.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-8" />
                ))}
              </div>
            ) : summary.data?.byCategory?.length ? (
              <div className="space-y-4">
                {summary.data.byCategory.map((item) => {
                  const total = summary.data?.monthlyTotalUzs || 1
                  return (
                    <div key={item.category}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700">{humanize(item.category)}</span>
                        <span className="font-semibold text-slate-950">
                          {formatMoney(item.monthlyCostUzs, summary.data?.baseCurrency || 'UZS')}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-800"
                          style={{ width: `${Math.min((item.monthlyCostUzs / total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState title="No category data" description="Category totals will appear here." />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Upcoming renewals */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-950">Upcoming renewals</h3>
            <p className="mt-1 text-sm text-slate-500">Your next five active subscription payments</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/subscriptions">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {upcoming.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-16" />
              ))}
            </div>
          ) : upcoming.data?.content.length ? (
            <div className="divide-y divide-slate-100">
              {upcoming.data.content.map((item) => (
                <Link
                  to={`/subscriptions/${item.id}`}
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:text-teal-700"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                      <CalendarClock className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {humanize(item.category)} · {humanize(item.frequency)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-950">
                      {formatMoney(item.price, item.currency)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(item.nextPaymentDate)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active renewals"
              description="Add an active subscription to see its next payment date."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  note: string
  icon: ElementType
  loading: boolean
}

function MetricCard({ label, value, note, icon: Icon, loading }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            {loading ? (
              <Skeleton className="mt-3 h-8 w-32" />
            ) : (
              <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">{value}</p>
            )}
            <p className="mt-2 truncate text-xs text-slate-400">{note}</p>
          </div>
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
