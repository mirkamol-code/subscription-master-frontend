import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, PieChart, TrendingUp } from 'lucide-react'
import { CategoryIcon } from '@/components/common/category-icon'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { RenewalPill } from '@/components/common/renewal-pill'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrency } from '@/features/currency/currency-context'
import { CurrencyRateCard } from '@/features/currency/currency-rate-card'
import { GmailCard } from '@/features/gmail/gmail-card'
import { NeedsReviewCard } from '@/features/subscriptions/needs-review-card'
import { useMonthlyDynamics, useSummary } from '@/hooks/use-statistics'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import { getCategoryMeta } from '@/lib/category-config'
import { cn, formatCompactMoney, formatDate, formatMonthLabel, formatMoney } from '@/lib/utils'
import type { Currency, MonthlyCost, SpendingSummary, Subscription } from '@/types/api'

const TREND_MONTHS = 6
const UPCOMING_COUNT = 5

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const summary = useSummary()
  const dynamics = useMonthlyDynamics(TREND_MONTHS)
  const upcoming = useSubscriptions({
    status: 'ACTIVE',
    page: 0,
    size: UPCOMING_COUNT,
    sort: ['nextPaymentDate,ASC'],
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting()}
        description={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      />

      <GmailCard />
      <NeedsReviewCard />

      <SpendHero
        summary={summary.data}
        loading={summary.isLoading}
        failed={summary.isError}
        onRetry={() => void summary.refetch()}
        activeCount={upcoming.data?.totalElements}
        nextPayment={upcoming.data?.content[0]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Spending trend</CardTitle>
              <CardDescription>Last {TREND_MONTHS} months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {dynamics.isLoading ? (
              <Skeleton className="h-56" />
            ) : dynamics.isError ? (
              <ErrorState bare error={dynamics.error} onRetry={() => void dynamics.refetch()} />
            ) : dynamics.data?.some((month) => month.costUzs > 0) ? (
              <TrendChart months={dynamics.data} />
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No history yet"
                description="Your monthly spending will chart here as payments go through."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>By category</CardTitle>
              <CardDescription>Share of monthly spend</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {summary.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-8" />
                ))}
              </div>
            ) : summary.isError ? (
              <ErrorState bare error={summary.error} onRetry={() => void summary.refetch()} />
            ) : summary.data?.byCategory.length ? (
              <CategoryBreakdown summary={summary.data} />
            ) : (
              <EmptyState
                icon={PieChart}
                title="Nothing to split yet"
                description="Categories appear once you have active subscriptions."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Coming up</CardTitle>
              <CardDescription>Your next payments</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="-mr-2 -mt-1 text-slate-500">
              <Link to="/subscriptions">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-4">
            {upcoming.isLoading ? (
              <div className="space-y-2 px-3">
                {[0, 1, 2].map((n) => (
                  <Skeleton key={n} className="h-14" />
                ))}
              </div>
            ) : upcoming.isError ? (
              <ErrorState bare error={upcoming.error} onRetry={() => void upcoming.refetch()} />
            ) : upcoming.data?.content.length ? (
              <ul>
                {upcoming.data.content.map((item) => (
                  <UpcomingRow key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={CalendarCheck}
                title="All clear"
                description="No active subscriptions to renew. New ones appear when Gmail finds their receipts."
              />
            )}
          </CardContent>
        </Card>

        <CurrencyRateCard />
      </div>
    </div>
  )
}

function SpendHero({
  summary,
  loading,
  failed,
  onRetry,
  activeCount,
  nextPayment,
}: {
  summary?: SpendingSummary
  loading: boolean
  failed: boolean
  onRetry: () => void
  activeCount?: number
  nextPayment?: Subscription
}) {
  const { displayCurrency, convertToDisplay } = useCurrency()
  const baseCurrency = (summary?.baseCurrency || 'UZS') as Currency
  const monthly = convertToDisplay(summary?.monthlyTotalUzs ?? 0, baseCurrency)
  const topExpense = summary?.mostExpensive

  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-teal-500/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/3 size-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="text-sm text-slate-400">You spend each month</p>
          {loading ? (
            <Skeleton className="mt-3 h-12 w-64 bg-white/10" />
          ) : failed ? (
            <div className="mt-3 flex items-center gap-3">
              <p className="text-lg text-slate-300">Couldn’t load your totals.</p>
              <Button variant="subtle" size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl animate-fade-in">
              {formatMoney(monthly, displayCurrency)}
            </p>
          )}
          {!loading && !failed && (
            <p className="mt-3 text-sm text-slate-400">
              About{' '}
              <span className="font-medium text-slate-200">
                {formatMoney(monthly * 12, displayCurrency)}
              </span>{' '}
              a year
            </p>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          <HeroStat label="Active" value={activeCount === undefined ? '—' : String(activeCount)} />
          <HeroStat
            label="Next up"
            value={nextPayment ? formatDate(nextPayment.nextPaymentDate).replace(/, \d{4}$/, '') : '—'}
            hint={nextPayment?.name}
          />
          <HeroStat
            label="Biggest"
            value={
              topExpense
                ? formatCompactMoney(convertToDisplay(topExpense.monthlyCostUzs, baseCurrency), displayCurrency)
                : '—'
            }
            hint={topExpense?.subscriptionName}
          />
        </dl>
      </div>
    </section>
  )
}

function HeroStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 truncate text-lg font-semibold tabular-nums">{value}</dd>
      {hint && <dd className="truncate text-xs text-slate-500">{hint}</dd>}
    </div>
  )
}

function TrendChart({ months }: { months: MonthlyCost[] }) {
  const { displayCurrency, convertToDisplay } = useCurrency()
  const values = months.map((month) => convertToDisplay(month.costUzs, 'UZS'))
  const max = Math.max(...values, 1)
  const average = values.reduce((sum, value) => sum + value, 0) / values.length

  return (
    <div>
      <div className="flex h-52 items-end gap-2 sm:gap-4" role="list" aria-label="Monthly spending">
        {months.map((month, index) => {
          const isLatest = index === months.length - 1
          const label = formatMonthLabel(month.month)
          return (
            <div
              key={month.month}
              role="listitem"
              aria-label={`${label}: ${formatMoney(values[index], displayCurrency)}`}
              className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="pointer-events-none absolute -top-1 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {formatMoney(values[index], displayCurrency)}
              </span>
              <div className="flex w-full max-w-14 flex-1 items-end">
                <div
                  className={cn(
                    'w-full rounded-lg transition-all duration-500',
                    isLatest
                      ? 'bg-linear-to-t from-teal-600 to-emerald-400'
                      : 'bg-slate-200 group-hover:bg-slate-300',
                  )}
                  style={{ height: `${Math.max((values[index] / max) * 100, 3)}%` }}
                />
              </div>
              <span className={cn('text-xs', isLatest ? 'font-semibold text-slate-900' : 'text-slate-400')}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-5 border-t border-slate-100 pt-4 text-[13px] text-slate-500">
        Monthly average{' '}
        <span className="font-semibold tabular-nums text-slate-900">
          {formatMoney(average, displayCurrency)}
        </span>
      </p>
    </div>
  )
}

function CategoryBreakdown({ summary }: { summary: SpendingSummary }) {
  const { displayCurrency, convertToDisplay } = useCurrency()
  const baseCurrency = (summary.baseCurrency || 'UZS') as Currency
  const total = summary.byCategory.reduce((sum, item) => sum + item.monthlyCostUzs, 0) || 1

  return (
    <div className="space-y-5">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {summary.byCategory.map((item) => (
          <div
            key={item.category}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(item.monthlyCostUzs / total) * 100}%`,
              backgroundColor: getCategoryMeta(item.category).accentColor,
            }}
          />
        ))}
      </div>
      <ul className="space-y-3">
        {summary.byCategory.map((item) => (
          <li key={item.category} className="flex items-center gap-3 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: getCategoryMeta(item.category).accentColor }}
            />
            <span className="flex-1 truncate text-slate-600">{getCategoryMeta(item.category).label}</span>
            <span className="font-medium tabular-nums text-slate-900">
              {formatMoney(convertToDisplay(item.monthlyCostUzs, baseCurrency), displayCurrency)}
            </span>
            <span className="w-9 text-right text-xs tabular-nums text-slate-400">
              {Math.round((item.monthlyCostUzs / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function UpcomingRow({ item }: { item: Subscription }) {
  return (
    <li>
      <Link
        to={`/subscriptions/${item.id}`}
        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50"
      >
        <CategoryIcon category={item.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-900">{item.name}</p>
          <p className="text-[13px] text-slate-400">{formatDate(item.nextPaymentDate)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-semibold tabular-nums text-slate-900">
            {formatMoney(item.price, item.currency)}
          </span>
          <RenewalPill date={item.nextPaymentDate} />
        </div>
      </Link>
    </li>
  )
}
