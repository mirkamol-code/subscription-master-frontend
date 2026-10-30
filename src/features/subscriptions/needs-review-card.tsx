import { Link } from 'react-router-dom'
import { CategoryIcon } from '@/components/common/category-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscriptionActions } from '@/features/subscriptions/use-subscription-actions'
import { useAllSubscriptions } from '@/hooks/use-subscriptions'
import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatMoney } from '@/lib/utils'

/** Subscriptions found in emails whose details were guessed; shown only while there are some. */
export function NeedsReviewCard() {
  const subscriptions = useAllSubscriptions()
  const actions = useSubscriptionActions()
  const toReview = subscriptions.data?.filter((item) => item.needsReview) ?? []

  if (!toReview.length) return null

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Needs review</CardTitle>
          <CardDescription>
            We guessed some details from your emails. Confirm or correct {toReview.length === 1 ? 'it' : 'them'}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        <ul className="divide-y divide-slate-100">
          {toReview.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
              <CategoryIcon category={item.category} size="sm" />
              <Link to={`/subscriptions/${item.id}`} className="min-w-0 flex-1 truncate font-medium text-slate-900 hover:text-teal-700">
                {item.name}
              </Link>
              <span className="text-sm tabular-nums text-slate-600">
                {formatMoney(item.price, item.currency)}
                <span className="text-slate-400">{FREQUENCY_SUFFIX[item.frequency]}</span>
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => actions.confirmReview(item)} disabled={actions.isConfirmingReview}>
                  Looks right
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to={`/subscriptions/${item.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
