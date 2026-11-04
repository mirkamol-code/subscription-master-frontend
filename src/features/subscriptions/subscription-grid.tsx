import { formatSubscriptionPrice } from '@/features/subscriptions/subscription-price'
import { Link } from 'react-router-dom'
import { SubscriptionLogo } from '@/components/common/subscription-logo'
import { NeedsReviewBadge } from '@/components/common/needs-review-badge'
import {
  SubscriptionActionsMenu,
  type SubscriptionItemActions,
} from '@/features/subscriptions/subscription-actions-menu'
import { SubscriptionRenewal } from '@/features/subscriptions/subscription-renewal'
import { getCategoryMeta } from '@/lib/category-config'
import { isRenewing } from '@/lib/renewals'
import { cn, formatDate } from '@/lib/utils'
import type { Subscription } from '@/types/api'

export interface SubscriptionListProps extends SubscriptionItemActions {
  items: Subscription[]
}

export function SubscriptionGrid({ items, ...actions }: SubscriptionListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li
          key={item.id}
          style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
          className={cn(
            'group relative flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all duration-200 animate-slide-up',
            'hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-lg hover:shadow-black/5',
            !isRenewing(item) && 'bg-fg/[0.03]',
          )}
        >
          <div className="flex items-start gap-3">
            <SubscriptionLogo merchantKey={item.merchantKey} category={item.category} />
            <div className="min-w-0 flex-1">
              <Link
                to={`/subscriptions/${item.id}`}
                className="block truncate font-semibold text-fg outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {item.name}
              </Link>
              <p className="flex items-center gap-2 truncate text-[13px] text-muted">
                {getCategoryMeta(item.category).label}
                {item.needsReview && <NeedsReviewBadge />}
              </p>
            </div>
            <SubscriptionActionsMenu item={item} {...actions} className="relative z-10 -mr-1.5 -mt-1" />
          </div>

          <p className="mt-6 text-2xl font-semibold tracking-tight tabular-nums text-fg">
            {formatSubscriptionPrice(item)}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-[13px] text-muted">
            <span>{isRenewing(item) ? formatDate(item.nextPaymentDate ?? undefined) : item.status === 'TRIAL' ? 'Free trial' : 'Not renewing'}</span>
            <SubscriptionRenewal item={item} />
          </div>
        </li>
      ))}
    </ul>
  )
}
