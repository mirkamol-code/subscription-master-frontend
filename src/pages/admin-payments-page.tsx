import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/input'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { DueCalendarView } from '@/features/admin/due-calendar-view'
import { DueLegend } from '@/features/admin/due-legend'
import { UpcomingPaymentsList } from '@/features/admin/upcoming-payments-list'
import { useSearchParamUpdater } from '@/features/admin/use-search-param-updater'
import { useDuePayments, useMerchantOptions, useUpcomingPayments } from '@/hooks/use-admin'
import type { VisibleRange } from '@/features/admin/types'
import { STATUS_LABEL } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { SubscriptionStatus } from '@/types/api'
import { NotFoundPage } from '@/pages/not-found-page'

const RENEWING_STATUSES: SubscriptionStatus[] = ['ACTIVE', 'BILLING_REQUIRED']

function readStatus(value: string | null): SubscriptionStatus | undefined {
  return RENEWING_STATUSES.find((status) => status === value)
}

export function AdminPaymentsPage() {
  const { searchParams, updateParams } = useSearchParamUpdater()
  const merchant = searchParams.get('merchant') ?? ''
  const status = readStatus(searchParams.get('status'))
  const [visibleRange, setVisibleRange] = useState<VisibleRange | null>(null)
  const merchants = useMerchantOptions()
  const upcomingQuery = useUpcomingPayments()
  const dueQuery = useDuePayments(
    visibleRange && { ...visibleRange, ...(merchant && { merchant }), ...(status && { status }) },
  )

  if (isForbiddenOrMissing(upcomingQuery.error) || isForbiddenOrMissing(dueQuery.error)) return <NotFoundPage embedded />

  const timeZone = upcomingQuery.data?.timeZone ?? dueQuery.data?.timeZone

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment calendar"
        description={`Next payment dates across all Users${timeZone ? `, shown in ${timeZone}` : ''}. Cancelled subscriptions that won’t renew are left out.`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Select aria-label="Merchant" value={merchant} onChange={(event) => updateParams({ merchant: event.target.value }, true)}>
              <option value="">All merchants</option>
              {(merchants.data ?? []).map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </Select>
            <Select aria-label="Status" value={status ?? ''} onChange={(event) => updateParams({ status: event.target.value }, true)}>
              <option value="">Active and billing required</option>
              {RENEWING_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABEL[value]}
                </option>
              ))}
            </Select>
          </div>

          <Card className={cn('space-y-4 p-4 transition-opacity sm:p-6', dueQuery.isPlaceholderData && 'opacity-60')}>
            {dueQuery.isError && (
              <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-danger/10 px-4 py-3 text-[13px] text-danger">
                <AlertTriangle className="size-4" /> Couldn’t load payments for this range.
                <Button variant="outline" size="sm" onClick={() => void dueQuery.refetch()}>
                  Try again
                </Button>
              </div>
            )}
            <p aria-live="polite" className="sr-only">
              {dueQuery.isFetching ? 'Loading payments…' : ''}
            </p>
            {dueQuery.isLoading && <p className="text-[13px] text-muted">Loading payments…</p>}
            <DueCalendarView
              entries={dueQuery.data?.entries ?? []}
              today={upcomingQuery.data?.today ?? dueQuery.data?.today}
              onRangeChange={setVisibleRange}
            />
            <DueLegend />
          </Card>
        </div>

        <div className="order-first lg:order-none">
          <UpcomingPaymentsList
            upcoming={upcomingQuery.data}
            isLoading={upcomingQuery.isLoading}
            error={upcomingQuery.error}
            onRetry={() => void upcomingQuery.refetch()}
          />
        </div>
      </div>
    </div>
  )
}
