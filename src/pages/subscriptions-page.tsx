import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, List, Plus, SearchX } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionCalendar } from '@/features/subscriptions/subscription-calendar'
import { HiddenToggleLabel } from '@/features/subscriptions/hidden-toggle-label'
import { SubscriptionFilters } from '@/features/subscriptions/subscription-filters'
import { DEFAULT_SORT, type FilterValues } from '@/features/subscriptions/subscription-filter-options'
import { SubscriptionGrid } from '@/features/subscriptions/subscription-grid'
import { SubscriptionTable } from '@/features/subscriptions/subscription-table'
import { useSubscriptionActions } from '@/features/subscriptions/use-subscription-actions'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import { cn } from '@/lib/utils'
import type { Category, Currency, SubscriptionStatus } from '@/types/api'

const PAGE_SIZE = 12

const VIEWS = [
  { value: 'grid', label: 'Cards', icon: LayoutGrid },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
] as const

type View = (typeof VIEWS)[number]['value']

function toNumber(value: string) {
  const parsed = Number(value)
  return value && Number.isFinite(parsed) ? parsed : undefined
}

export function SubscriptionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const view: View = VIEWS.some((v) => v.value === searchParams.get('view'))
    ? (searchParams.get('view') as View)
    : 'grid'
  const page = Math.max(Number(searchParams.get('page')) || 0, 0)
  const isShowingHidden = searchParams.get('hidden') === '1'

  const filters: FilterValues = {
    name: searchParams.get('name') ?? '',
    status: searchParams.get('status') ?? '',
    category: searchParams.get('category') ?? '',
    currency: searchParams.get('currency') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    sort: searchParams.get('sort') ?? DEFAULT_SORT,
  }

  const listQuery = useSubscriptions({
    page,
    size: PAGE_SIZE,
    name: filters.name.trim() || undefined,
    status: (filters.status || undefined) as SubscriptionStatus | undefined,
    category: (filters.category || undefined) as Category | undefined,
    currency: (filters.currency || undefined) as Currency | undefined,
    minPrice: toNumber(filters.minPrice),
    maxPrice: toNumber(filters.maxPrice),
    sort: [filters.sort],
    hidden: isShowingHidden || undefined,
  })
  const actions = useSubscriptionActions()

  const updateParams = (changes: Record<string, string>, replace = false) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace },
    )
  }

  const setFilter = (key: keyof FilterValues, value: string) =>
    updateParams({ [key]: key === 'sort' && value === DEFAULT_SORT ? '' : value, page: '' }, true)

  const clearFilters = () =>
    setSearchParams(view === 'grid' ? {} : { view }, { replace: true })

  const data = listQuery.data
  const items = data?.content ?? []

  // Deleting the last item on a page leaves it empty — step back to a page that has results.
  const lastPage = Math.max((data?.totalPages ?? 1) - 1, 0)
  useEffect(() => {
    if (!data || page <= lastPage) return
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (lastPage) next.set('page', String(lastPage))
        else next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [data, page, lastPage, setSearchParams])

  const hasFilters =
    isShowingHidden ||
    Object.entries(filters).some(([key, value]) => value && !(key === 'sort' && value === DEFAULT_SORT))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description={
          data && view !== 'calendar'
            ? `${data.totalElements} ${data.totalElements === 1 ? 'subscription' : 'subscriptions'}`
            : 'Everything you pay for on repeat'
        }
        actions={
          <>
            <div role="tablist" aria-label="View" className="flex rounded-xl bg-slate-200/50 p-1">
              {VIEWS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={view === value}
                  aria-label={label}
                  title={label}
                  onClick={() => updateParams({ view: value === 'grid' ? '' : value })}
                  className={cn(
                    'grid size-8 place-items-center rounded-lg transition-all',
                    view === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
            {view !== 'calendar' && (
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={isShowingHidden}
                onClick={() => updateParams({ hidden: isShowingHidden ? '' : '1', page: '' })}
              >
                <HiddenToggleLabel isHidden={isShowingHidden} hideLabel="Show hidden" unhideLabel="Show tracked" />
              </Button>
            )}
            <Button asChild variant="accent">
              <Link to="/subscriptions/new">
                <Plus className="size-4" /> Add
              </Link>
            </Button>
          </>
        }
      />

      {view === 'calendar' ? (
        <SubscriptionCalendar />
      ) : (
        <>
          <SubscriptionFilters values={filters} onChange={setFilter} onClear={clearFilters} />

          {listQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : listQuery.isError ? (
            <ErrorState error={listQuery.error} onRetry={() => void listQuery.refetch()} />
          ) : items.length === 0 ? (
            <Card>
              {hasFilters ? (
                <EmptyState
                  icon={SearchX}
                  title="No matches"
                  description="Nothing fits these filters. Try a different search or clear them."
                  action={
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  title="No subscriptions yet"
                  description="Add the services you pay for to see what you spend and when it renews."
                  action={
                    <Button asChild variant="accent" size="sm">
                      <Link to="/subscriptions/new">
                        <Plus className="size-4" /> Add your first
                      </Link>
                    </Button>
                  }
                />
              )}
            </Card>
          ) : view === 'grid' ? (
            <SubscriptionGrid
              items={items}
              onChangeStatus={actions.changeStatus}
              onToggleHidden={actions.toggleHidden}
              onDelete={actions.requestDelete}
            />
          ) : (
            <SubscriptionTable
              items={items}
              onChangeStatus={actions.changeStatus}
              onToggleHidden={actions.toggleHidden}
              onDelete={actions.requestDelete}
            />
          )}

          {data && data.totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
              <p className="text-[13px] text-slate-500">
                Page {data.number + 1} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.first}
                  onClick={() => updateParams({ page: page > 1 ? String(page - 1) : '' })}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.last}
                  onClick={() => updateParams({ page: String(page + 1) })}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </nav>
          )}
        </>
      )}

      <ConfirmDialog {...actions.deleteDialog} />
    </div>
  )
}
