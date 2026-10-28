import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryIcon } from '@/components/common/category-icon'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrency } from '@/features/currency/currency-context'
import { useAllSubscriptions } from '@/hooks/use-subscriptions'
import { getCategoryMeta } from '@/lib/category-config'
import { renewalDatesInMonth } from '@/lib/renewals'
import { cn, formatMoney, parseLocalDate, toIsoDate, todayIsoDate } from '@/lib/utils'
import type { Subscription } from '@/types/api'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_CHIPS = 2

interface Charge {
  date: string
  subscription: Subscription
  amount: number
}

/** Six weeks of days, Monday first, covering the given month. */
function buildMonthGrid(year: number, month: number) {
  const mondayOffset = (new Date(year, month, 1).getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, 1 - mondayOffset + index)
    return { iso: toIsoDate(date), day: date.getDate(), inMonth: date.getMonth() === month }
  })
}

export function SubscriptionCalendar() {
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const query = useAllSubscriptions()
  const { displayCurrency, convertToDisplay } = useCurrency()
  const today = todayIsoDate()

  const charges = useMemo<Charge[]>(
    () =>
      (query.data ?? [])
        .flatMap((subscription) =>
          renewalDatesInMonth(subscription, cursor.year, cursor.month).map((date) => ({
            date,
            subscription,
            amount: convertToDisplay(subscription.price, subscription.currency),
          })),
        )
        .sort((a, b) => a.date.localeCompare(b.date) || b.amount - a.amount),
    [query.data, cursor, convertToDisplay],
  )

  const chargesByDate = useMemo(() => {
    const map = new Map<string, Charge[]>()
    for (const charge of charges) map.set(charge.date, [...(map.get(charge.date) ?? []), charge])
    return map
  }, [charges])

  const upcomingTotal = charges.reduce((sum, charge) => sum + charge.amount, 0)
  const monthLabel = new Date(cursor.year, cursor.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const isCurrentMonth = cursor.year === now.getFullYear() && cursor.month === now.getMonth()
  const isPastMonth = new Date(cursor.year, cursor.month + 1, 0) < new Date(now.getFullYear(), now.getMonth(), 1)
  const monthName = monthLabel.split(' ')[0]

  const shiftMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }

  return (
    <div className="grid gap-5 animate-fade-in lg:grid-cols-[1fr_300px]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            {!isCurrentMonth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}
              >
                Today
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(1)} aria-label="Next month">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-y border-slate-100 bg-slate-50/60">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="py-2 text-center text-xs font-medium text-slate-400">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {buildMonthGrid(cursor.year, cursor.month).map(({ iso, day, inMonth }, index) => {
            const dayCharges = chargesByDate.get(iso) ?? []
            const isToday = iso === today
            return (
              <div
                key={iso}
                className={cn(
                  'min-h-16 border-slate-100 p-1.5 sm:min-h-24',
                  index % 7 !== 6 && 'border-r',
                  index < 35 && 'border-b',
                  !inMonth && 'bg-slate-50/50',
                )}
              >
                <span
                  className={cn(
                    'grid size-6 place-items-center rounded-full text-xs font-medium',
                    isToday ? 'bg-teal-600 text-white' : inMonth ? 'text-slate-700' : 'text-slate-300',
                  )}
                >
                  {day}
                </span>

                {/* Phones: one dot per charge */}
                <div className="mt-1 flex flex-wrap gap-0.5 px-1 sm:hidden">
                  {dayCharges.map(({ subscription }) => (
                    <span
                      key={subscription.id}
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: getCategoryMeta(subscription.category).accentColor }}
                    />
                  ))}
                </div>

                {/* Larger screens: named chips */}
                <div className="mt-1 hidden space-y-0.5 sm:block">
                  {dayCharges.slice(0, MAX_CHIPS).map(({ subscription }) => {
                    const color = getCategoryMeta(subscription.category).accentColor
                    return (
                      <Link
                        key={subscription.id}
                        to={`/subscriptions/${subscription.id}`}
                        title={`${subscription.name} · ${formatMoney(subscription.price, subscription.currency)}`}
                        className="block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-75"
                        style={{ backgroundColor: `${color}14`, color }}
                      >
                        {subscription.name}
                      </Link>
                    )
                  })}
                  {dayCharges.length > MAX_CHIPS && (
                    <span className="block px-1.5 text-[11px] text-slate-400">
                      +{dayCharges.length - MAX_CHIPS} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="space-y-5">
        <Card className="p-5">
          <p className="text-[13px] text-slate-500">Upcoming in {monthName}</p>
          {query.isLoading ? (
            <Skeleton className="mt-2 h-8 w-36" />
          ) : (
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
              {formatMoney(upcomingTotal, displayCurrency)}
            </p>
          )}
          <p className="mt-1 text-[13px] text-slate-400">
            {charges.length} {charges.length === 1 ? 'payment' : 'payments'}
          </p>
        </Card>

        <Card className="overflow-hidden">
          <h3 className="px-5 pt-5 text-[13px] font-medium text-slate-500">Upcoming payments</h3>
          {query.isLoading ? (
            <div className="space-y-2 p-5">
              {[0, 1, 2].map((n) => (
                <Skeleton key={n} className="h-10" />
              ))}
            </div>
          ) : charges.length === 0 ? (
            <p className="px-5 pb-6 pt-3 text-sm text-slate-400">
              {isPastMonth
                ? 'Past payments are listed on each subscription’s page.'
                : `Nothing else due in ${monthName}.`}
            </p>
          ) : (
            <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto px-2 py-2">
              {charges.map(({ date, subscription, amount }) => (
                <li key={`${subscription.id}-${date}`}>
                  <Link
                    to={`/subscriptions/${subscription.id}`}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50',
                      date < today && 'opacity-50',
                    )}
                  >
                    <CategoryIcon category={subscription.category} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{subscription.name}</p>
                      <p className="text-xs text-slate-400">
                        {parseLocalDate(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-slate-700">
                      {formatMoney(amount, displayCurrency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
