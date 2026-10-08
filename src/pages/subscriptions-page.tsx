import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Filter, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteSubscription, useSubscriptions } from '@/hooks/use-subscriptions'
import { formatDate, formatMoney, humanize } from '@/lib/utils'
import {
  currencies,
  subscriptionStatuses,
  type Currency,
  type Subscription,
  type SubscriptionStatus,
} from '@/types/api'

// Intentionally h-10 (shorter than form inputs) and slate-700 text — this is the filter-bar variant.
const filterSelectClass =
  'h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15'

export function SubscriptionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null)

  const page = Math.max(Number(searchParams.get('page') || 0), 0)
  const status = searchParams.get('status') as SubscriptionStatus | null
  const currency = searchParams.get('currency') as Currency | null
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') || 'nextPaymentDate,ASC'

  const query = useSubscriptions({
    page,
    size: 10,
    status: status || undefined,
    currency: currency || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: [sort],
  })
  const deleteMutation = useDeleteSubscription()

  const setFilter = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    if (name !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success(`${deleteTarget.name} was deleted`)
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">All subscriptions</h2>
          <p className="mt-1 text-sm text-slate-500">Filter, review, and manage recurring services.</p>
        </div>
        <Button asChild variant="accent">
          <Link to="/subscriptions/new">
            <Plus className="size-4" /> Add subscription
          </Link>
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="size-4" /> Filters
          </div>
          <select
            aria-label="Filter by status"
            className={filterSelectClass}
            value={status || ''}
            onChange={(event) => setFilter('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {subscriptionStatuses.map((item) => (
              <option key={item} value={item}>
                {humanize(item)}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by currency"
            className={filterSelectClass}
            value={currency || ''}
            onChange={(event) => setFilter('currency', event.target.value)}
          >
            <option value="">All currencies</option>
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            aria-label="Minimum price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Min price"
            value={minPrice || ''}
            onChange={(event) => setFilter('minPrice', event.target.value)}
            className={`${filterSelectClass} w-28`}
          />
          <input
            aria-label="Maximum price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Max price"
            value={maxPrice || ''}
            onChange={(event) => setFilter('maxPrice', event.target.value)}
            className={`${filterSelectClass} w-28`}
          />
          <select
            aria-label="Sort subscriptions"
            className={`${filterSelectClass} sm:ml-auto`}
            value={sort}
            onChange={(event) => setFilter('sort', event.target.value)}
          >
            <option value="nextPaymentDate,ASC">Renewal: soonest</option>
            <option value="nextPaymentDate,DESC">Renewal: latest</option>
            <option value="price,ASC">Price: low to high</option>
            <option value="price,DESC">Price: high to low</option>
            <option value="name,ASC">Name: A–Z</option>
          </select>
        </div>
      </Card>

      {/* Subscription table */}
      <Card className="overflow-hidden">
        {query.isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-14" />
            ))}
          </div>
        ) : query.isError ? (
          <div className="p-5">
            <ErrorState error={query.error} onRetry={() => void query.refetch()} />
          </div>
        ) : !query.data?.content.length ? (
          <EmptyState
            title="No subscriptions found"
            description="Try changing the filters or add your first subscription."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Subscription</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Next payment</th>
                    <th className="px-5 py-3">Frequency</th>
                    <th className="w-14 px-5 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {query.data.content.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <Link to={`/subscriptions/${item.id}`} className="block">
                          <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {humanize(item.category)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatMoney(item.price, item.currency)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(item.nextPaymentDate)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{humanize(item.frequency)}</td>
                      <td className="px-5 py-4">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              aria-label={`Actions for ${item.name}`}
                              className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              className="z-30 min-w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                            >
                              <DropdownMenu.Item asChild>
                                <Link
                                  to={`/subscriptions/${item.id}/edit`}
                                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-50 focus:bg-slate-50"
                                >
                                  <Pencil className="size-4" /> Edit
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => setDeleteTarget(item)}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50"
                              >
                                <Trash2 className="size-4" /> Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row">
              <p className="text-sm text-slate-500">
                Showing {query.data.number * query.data.size + 1}–
                {query.data.number * query.data.size + query.data.numberOfElements} of{' '}
                {query.data.totalElements}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={query.data.first}
                  onClick={() => setFilter('page', String(page - 1))}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <span className="px-2 text-sm font-medium text-slate-600">
                  Page {query.data.number + 1} of {query.data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={query.data.last}
                  onClick={() => setFilter('page', String(page + 1))}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete subscription?"
        description={
          deleteTarget
            ? `This permanently deletes ${deleteTarget.name}. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
        pending={deleteMutation.isPending}
      />
    </div>
  )
}
