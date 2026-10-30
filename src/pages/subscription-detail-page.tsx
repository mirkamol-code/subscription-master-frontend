import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, History, Pencil, Receipt, Trash2, TriangleAlert } from 'lucide-react'
import { CategoryIcon } from '@/components/common/category-icon'
import { NeedsReviewBadge } from '@/components/common/needs-review-badge'
import { ErrorState } from '@/components/common/error-state'
import { RenewalPill } from '@/components/common/renewal-pill'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { useCurrency } from '@/features/currency/currency-context'
import { HiddenToggleLabel } from '@/features/subscriptions/hidden-toggle-label'
import { ReviewActions } from '@/features/subscriptions/review-actions'
import { STATUS_CHOICE_UI } from '@/features/subscriptions/status-choice-ui'
import { describeStatusChange } from '@/features/subscriptions/status-change-description'
import { getStatusChoices } from '@/features/subscriptions/status-choices'
import { useSubscriptionActions } from '@/features/subscriptions/use-subscription-actions'
import { useStatusHistory, useSubscription, useSubscriptionHistory } from '@/hooks/use-subscriptions'
import { getCategoryMeta } from '@/lib/category-config'
import { isRenewing } from '@/lib/renewals'
import type { Tone } from '@/lib/tone'
import { FREQUENCY_LABEL, FREQUENCY_SUFFIX } from '@/lib/labels'
import { cn, formatDate, formatMoney, getAnnualizedCost, getMonthlyEquivalent, todayIsoDate, toLocalIsoDate } from '@/lib/utils'
import type { Subscription } from '@/types/api'

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-3 text-slate-500">
      <Link to="/subscriptions">
        <ArrowLeft className="size-4" /> Subscriptions
      </Link>
    </Button>
  )
}

export function SubscriptionDetailPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const query = useSubscription(id)
  const actions = useSubscriptionActions({ onDeleted: () => navigate('/subscriptions') })

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!query.data) {
    return (
      <div className="space-y-6">
        <BackLink />
        <ErrorState
          title="Subscription not found"
          error={query.error}
          onRetry={Number.isFinite(id) ? () => void query.refetch() : undefined}
        />
      </div>
    )
  }

  const item = query.data

  return (
    <div className="space-y-6">
      <BackLink />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex min-w-0 items-center gap-4">
            <CategoryIcon category={item.category} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">{item.name}</h1>
                <StatusBadge status={item.status} />
                {item.needsReview && <NeedsReviewBadge />}
                {item.hidden && <span className="text-xs font-medium text-slate-400">Hidden</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {getCategoryMeta(item.category).label} · {FREQUENCY_LABEL[item.frequency]}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {getStatusChoices(item.status).map((status) => {
              const { icon: StatusIcon, label } = STATUS_CHOICE_UI[status]
              return (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => actions.changeStatus(item, status)}
                  disabled={actions.isChangingStatus}
                >
                  <StatusIcon className="size-4" />
                  {label}
                </Button>
              )
            })}
            <Button asChild variant="outline" size="sm">
              <Link to={`/subscriptions/${item.id}/edit`}>
                <Pencil className="size-4" /> Edit
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => actions.toggleHidden(item)}>
              <HiddenToggleLabel isHidden={item.hidden} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.requestDelete(item)}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-4">
          <Stat label="Price" value={formatMoney(item.price, item.currency)} hint={FREQUENCY_SUFFIX[item.frequency]} />
          <Stat
            label="Per month"
            value={formatMoney(getMonthlyEquivalent(item.price, item.frequency), item.currency)}
          />
          <Stat label="Per year" value={formatMoney(getAnnualizedCost(item.price, item.frequency), item.currency)} />
          <Stat label="Since" value={formatDate(item.startDate)} />
        </dl>
      </Card>

      {item.needsReview && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
            We guessed the amount, currency or billing cycle from an email. Check they’re right.
          </p>
          <ReviewActions item={item} onConfirm={actions.confirmReview} isConfirming={actions.isConfirmingReview} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <PaymentHistory subscription={item} />
        <NextPaymentCard subscription={item} />
        <StatusHistory subscription={item} />
      </div>

      <ConfirmDialog {...actions.deleteDialog} />
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white px-6 py-5 sm:px-8">
      <dt className="text-[13px] text-slate-500">{label}</dt>
      <dd className="mt-1 truncate font-semibold tabular-nums text-slate-900">
        {value}
        {hint && <span className="ml-0.5 font-normal text-slate-400">{hint}</span>}
      </dd>
    </div>
  )
}

function NextPaymentCard({ subscription }: { subscription: Subscription }) {
  const { displayCurrency, convertToDisplay } = useCurrency()
  const showConverted = subscription.currency !== displayCurrency

  return (
    <Card className="relative overflow-hidden bg-ink p-6 text-white">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-teal-500/25 blur-3xl" />
      <div className="relative">
        <p className="text-sm text-slate-400">Next payment</p>
        {isRenewing(subscription) ? (
          <>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatDate(subscription.nextPaymentDate)}</p>
            <RenewalPill date={subscription.nextPaymentDate} className="mt-3" />
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm text-slate-400">Amount</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatMoney(subscription.price, subscription.currency)}
              </p>
              {showConverted && (
                <p className="text-sm tabular-nums text-slate-400">
                  ≈ {formatMoney(convertToDisplay(subscription.price, subscription.currency), displayCurrency)}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-lg font-medium text-slate-200">{describeNoNextPayment(subscription)}</p>
        )}
      </div>
    </Card>
  )
}

function describeNoNextPayment(subscription: Subscription) {
  if (subscription.status === 'BILLING_REQUIRED') {
    return `Billing required — check your latest payment to ${subscription.name}.`
  }
  if (subscription.endsOn && subscription.endsOn >= todayIsoDate()) {
    return `Cancelled — access until ${formatDate(subscription.endsOn)}.`
  }
  return 'Cancelled — this won’t renew.'
}

const TONE_DOT: Record<Tone, string> = {
  positive: 'bg-emerald-500',
  neutral: 'bg-slate-400',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
}

function StatusHistory({ subscription }: { subscription: Subscription }) {
  const history = useStatusHistory(subscription.id)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Status history</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        {history.isLoading ? (
          <div className="space-y-2 px-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : history.isError ? (
          <ErrorState bare error={history.error} onRetry={() => void history.refetch()} />
        ) : !history.data?.length ? (
          <EmptyState
            icon={History}
            title="No status changes yet"
            description="Receipts, cancellations and failed payments will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.data.map((change) => {
              const description = describeStatusChange(change, subscription)
              return (
                <li key={change.id} className="flex items-start gap-3 px-3 py-3">
                  <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', TONE_DOT[description.tone])} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-slate-700">{description.text}</span>
                    {description.detail && (
                      <span className="block truncate text-xs text-slate-400">{description.detail}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(toLocalIsoDate(change.effectiveAt))}</span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function PaymentHistory({ subscription }: { subscription: Subscription }) {
  const history = useSubscriptionHistory(subscription.id)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Payment history</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        {history.isLoading ? (
          <div className="space-y-2 px-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : history.isError ? (
          <ErrorState bare error={history.error} onRetry={() => void history.refetch()} />
        ) : !history.data?.length ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description="Past payments for this subscription will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.data.map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-4 px-3 py-3">
                <span className="text-sm text-slate-600">{formatDate(record.chargedAt)}</span>
                <span className="text-right">
                  <span className="block font-medium tabular-nums text-slate-900">
                    {formatMoney(record.amount, record.currency)}
                  </span>
                  {record.currency !== 'UZS' && record.amountUzs > 0 && (
                    <span className="block text-xs tabular-nums text-slate-400">
                      ≈ {formatMoney(record.amountUzs, 'UZS')}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
