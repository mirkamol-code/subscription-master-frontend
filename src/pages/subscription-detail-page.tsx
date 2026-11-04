import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Receipt, Trash2, TriangleAlert } from 'lucide-react'
import { SubscriptionLogo } from '@/components/common/subscription-logo'
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
import { BillingEmailsCard } from '@/features/emails/billing-emails-card'
import { ReceiptAmountDialog } from '@/features/emails/receipt-amount-dialog'
import { findReceiptAwaitingAmount } from '@/features/emails/receipt-awaiting-amount'
import { useBillingEmails } from '@/features/emails/use-billing-emails'
import { HiddenToggleLabel } from '@/features/subscriptions/hidden-toggle-label'
import { describeBilling } from '@/features/subscriptions/billing-description'
import { formatSubscriptionPrice, hasKnownPrice } from '@/features/subscriptions/subscription-price'
import { describePriceChange } from '@/features/subscriptions/price-change-note'
import { ReviewActions } from '@/features/subscriptions/review-actions'
import { getReviewPrompt } from '@/features/subscriptions/review-prompt'
import { StatusHistoryCard } from '@/features/subscriptions/status-history-card'
import { STATUS_CHOICE_UI } from '@/features/subscriptions/status-choice-ui'
import { getStatusChoices } from '@/features/subscriptions/status-choices'
import { useSubscriptionActions } from '@/features/subscriptions/use-subscription-actions'
import { useSubscription, useSubscriptionHistory } from '@/hooks/use-subscriptions'
import { getCategoryMeta } from '@/lib/category-config'
import { isRenewing } from '@/lib/renewals'
import { FREQUENCY_LABEL, FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatDate, formatMoney, getAnnualizedCost, getMonthlyEquivalent, todayIsoDate } from '@/lib/utils'
import type { BillingEmail, Subscription } from '@/types/api'

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted">
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
  const emails = useBillingEmails(id)
  const actions = useSubscriptionActions({ onDeleted: () => navigate('/subscriptions') })
  const [receiptToPrice, setReceiptToPrice] = useState<BillingEmail | null>(null)
  const receiptAwaitingAmount = findReceiptAwaitingAmount(emails.data)

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
  const billing = describeBilling(item)
  const billingDetails = [
    billing.plan && `${billing.plan} plan`,
    billing.billedThrough,
    billing.paymentMethod && `Paid with ${billing.paymentMethod}`,
  ].filter(Boolean)
  const priceChangeNote = describePriceChange(item.latestPriceChange)

  return (
    <div className="space-y-6">
      <BackLink />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex min-w-0 items-center gap-4">
            <SubscriptionLogo merchantKey={item.merchantKey} category={item.category} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-fg">{item.name}</h1>
                <StatusBadge status={item.status} />
                {item.needsReview && <NeedsReviewBadge />}
                {item.hidden && <span className="text-xs font-medium text-muted">Hidden</span>}
              </div>
              <p className="mt-1 text-sm text-muted">
                {[getCategoryMeta(item.category).label, item.frequency && FREQUENCY_LABEL[item.frequency]].filter(Boolean).join(' · ')}
              </p>
              {billingDetails.length > 0 && <p className="mt-1 text-sm text-muted">{billingDetails.join(' · ')}</p>}
              {priceChangeNote && <p className="mt-1 text-sm text-warning">{priceChangeNote}</p>}
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
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-border bg-fg/[0.06] sm:grid-cols-4">
          {hasKnownPrice(item) && item.status !== 'TRIAL' ? (
            <>
              <Stat label="Price" value={formatMoney(item.price, item.currency)} hint={FREQUENCY_SUFFIX[item.frequency]} />
              <Stat
                label="Per month"
                value={formatMoney(getMonthlyEquivalent(item.price, item.frequency), item.currency)}
              />
              <Stat label="Per year" value={formatMoney(getAnnualizedCost(item.price, item.frequency), item.currency)} />
            </>
          ) : (
            <Stat label="Price" value={formatSubscriptionPrice(item)} />
          )}
          <Stat label="Since" value={formatDate(item.startDate)} />
        </dl>
      </Card>

      {item.needsReview && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-2xl bg-warning/10 px-5 py-4 text-sm text-warning sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {getReviewPrompt(item).message}
          </p>
          <ReviewActions
            item={item}
            onConfirm={actions.confirmReview}
            isConfirming={actions.isConfirmingReview}
            onEnterAmount={() => setReceiptToPrice(receiptAwaitingAmount ?? null)}
            canEnterAmount={!!receiptAwaitingAmount}
            onConfirmRecurring={actions.confirmRecurring}
            isConfirmingRecurring={actions.isConfirmingRecurring}
            onHide={actions.toggleHidden}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <PaymentHistory subscription={item} />
        <NextPaymentCard subscription={item} />
        <StatusHistoryCard subscription={item} />
        <BillingEmailsCard subscriptionId={item.id} onEnterAmount={setReceiptToPrice} />
      </div>

      <ReceiptAmountDialog
        subscriptionId={item.id}
        defaultCurrency={item.currency ?? 'USD'}
        receipt={receiptToPrice}
        onClose={() => setReceiptToPrice(null)}
      />
      <ConfirmDialog {...actions.deleteDialog} />
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-surface px-6 py-5 sm:px-8">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-1 truncate font-semibold tabular-nums text-fg">
        {value}
        {hint && <span className="ml-0.5 font-normal text-muted">{hint}</span>}
      </dd>
    </div>
  )
}

function NextPaymentCard({ subscription }: { subscription: Subscription }) {
  const { displayCurrency, convertToDisplay } = useCurrency()
  const showConverted = subscription.currency !== displayCurrency
  const nextDate = subscription.nextPaymentDate
  const priced = hasKnownPrice(subscription) ? subscription : null

  return (
    <Card className="dark relative overflow-hidden border-white/10 bg-hero p-6 text-white shadow-xl shadow-accent/15">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="relative">
        <p className="text-sm text-white/60">Next payment</p>
        {isRenewing(subscription) && nextDate && priced ? (
          <>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatDate(nextDate)}</p>
            <RenewalPill date={nextDate} className="mt-3" />
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm text-white/60">Amount</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatMoney(priced.price, priced.currency)}
              </p>
              {showConverted && (
                <p className="text-sm tabular-nums text-white/60">
                  ≈ {formatMoney(convertToDisplay(priced.price, priced.currency), displayCurrency)}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-lg font-medium text-white/50">{describeNoNextPayment(subscription)}</p>
        )}
      </div>
    </Card>
  )
}

function describeNoNextPayment(subscription: Subscription) {
  if (subscription.status === 'TRIAL') {
    const ends = subscription.trialEndsOn ? `ends ${formatDate(subscription.trialEndsOn)}` : 'end date unknown'
    const cancelled = subscription.endsOn ? ' (cancelled)' : ''
    const after = hasKnownPrice(subscription)
      ? `Then ${formatMoney(subscription.price, subscription.currency)}${FREQUENCY_SUFFIX[subscription.frequency]}.`
      : 'Price after the trial is unknown.'
    return `Free trial — ${ends}${cancelled}. ${after}`
  }
  if (subscription.status === 'BILLING_REQUIRED') {
    return `Billing required — check your latest payment to ${subscription.name}.`
  }
  if (subscription.endsOn && subscription.endsOn >= todayIsoDate()) {
    return `Cancelled — access until ${formatDate(subscription.endsOn)}.`
  }
  return 'Cancelled — this won’t renew.'
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
          <ul className="divide-y divide-border">
            {history.data.map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-4 px-3 py-3">
                <span className="text-sm text-muted">{formatDate(record.chargedAt)}</span>
                <span className="text-right">
                  <span className="block font-medium tabular-nums text-fg">
                    {formatMoney(record.amount, record.currency)}
                  </span>
                  {record.currency !== 'UZS' && record.amountUzs > 0 && (
                    <span className="block text-xs tabular-nums text-muted">
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
