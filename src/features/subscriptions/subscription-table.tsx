import { Link, useNavigate } from 'react-router-dom'
import { CategoryIcon } from '@/components/common/category-icon'
import { Card } from '@/components/ui/card'
import { SubscriptionActionsMenu } from '@/features/subscriptions/subscription-actions-menu'
import type { SubscriptionListProps } from '@/features/subscriptions/subscription-grid'
import { SubscriptionRenewal } from '@/features/subscriptions/subscription-renewal'
import { getCategoryMeta } from '@/lib/category-config'
import { FREQUENCY_LABEL } from '@/lib/labels'
import { isRenewing } from '@/lib/renewals'
import { formatDate, formatMoney } from '@/lib/utils'

export function SubscriptionTable({ items, ...actions }: SubscriptionListProps) {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-medium text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Billing</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Next payment</th>
              <th className="w-14 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/subscriptions/${item.id}`)}
                className="cursor-pointer transition-colors hover:bg-slate-50/80"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="min-w-0">
                      <Link
                        to={`/subscriptions/${item.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="block truncate font-medium text-slate-900 outline-none hover:text-teal-700 focus-visible:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400">{getCategoryMeta(item.category).label}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{FREQUENCY_LABEL[item.frequency]}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                  {formatMoney(item.price, item.currency)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {isRenewing(item) && (
                      <span className="text-slate-500">{formatDate(item.nextPaymentDate)}</span>
                    )}
                    <SubscriptionRenewal item={item} />
                  </div>
                </td>
                <td className="px-4 py-3.5" onClick={(event) => event.stopPropagation()}>
                  <SubscriptionActionsMenu item={item} {...actions} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
