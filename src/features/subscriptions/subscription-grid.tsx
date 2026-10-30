import { Link } from 'react-router-dom'
import { CategoryIcon } from '@/components/common/category-icon'
import { NeedsReviewBadge } from '@/components/common/needs-review-badge'
import {
  SubscriptionActionsMenu,
  type SubscriptionItemActions,
} from '@/features/subscriptions/subscription-actions-menu'
import { SubscriptionRenewal } from '@/features/subscriptions/subscription-renewal'
import { getCategoryMeta } from '@/lib/category-config'
import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { isRenewing } from '@/lib/renewals'
import { cn, formatDate, formatMoney } from '@/lib/utils'
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
            'group relative flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all duration-200 animate-slide-up',
            'hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-lg hover:shadow-slate-200/60',
            !isRenewing(item) && 'bg-slate-50/60',
          )}
        >
          <div className="flex items-start gap-3">
            <CategoryIcon category={item.category} />
            <div className="min-w-0 flex-1">
              <Link
                to={`/subscriptions/${item.id}`}
                className="block truncate font-semibold text-slate-900 outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-teal-500/60"
              >
                {item.name}
              </Link>
              <p className="flex items-center gap-2 truncate text-[13px] text-slate-500">
                {getCategoryMeta(item.category).label}
                {item.needsReview && <NeedsReviewBadge />}
              </p>
            </div>
            <SubscriptionActionsMenu item={item} {...actions} className="relative z-10 -mr-1.5 -mt-1" />
          </div>

          <p className="mt-6 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
            {formatMoney(item.price, item.currency)}
            <span className="ml-1 text-sm font-normal text-slate-400">
              {FREQUENCY_SUFFIX[item.frequency]}
            </span>
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[13px] text-slate-500">
            <span>{isRenewing(item) ? formatDate(item.nextPaymentDate) : 'Not renewing'}</span>
            <SubscriptionRenewal item={item} />
          </div>
        </li>
      ))}
    </ul>
  )
}
