import { Link } from 'react-router-dom'
import { CategoryIcon } from '@/components/common/category-icon'
import { ErrorState } from '@/components/common/error-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReviewActions } from '@/features/subscriptions/review-actions'
import { getReviewPrompt } from '@/features/subscriptions/review-prompt'
import { useSubscriptionActions } from '@/features/subscriptions/use-subscription-actions'
import { useAllSubscriptions } from '@/hooks/use-subscriptions'
import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatMoney } from '@/lib/utils'

export function NeedsReviewCard() {
  const subscriptions = useAllSubscriptions()
  const actions = useSubscriptionActions()
  const toReview = subscriptions.data?.filter((item) => item.needsReview) ?? []

  if (subscriptions.isError) {
    return (
      <Card className="p-4">
        <ErrorState bare error={subscriptions.error} onRetry={() => void subscriptions.refetch()} />
      </Card>
    )
  }
  if (!toReview.length) return null

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Needs review</CardTitle>
          <CardDescription>
            Some details from your emails need a look. Confirm or correct {toReview.length === 1 ? 'it' : 'them'}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        <ul className="divide-y divide-slate-100">
          {toReview.map((item) => {
            const prompt = getReviewPrompt(item)
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
                <CategoryIcon category={item.category} size="sm" />
                <span className="min-w-0 flex-1">
                  <Link
                    to={`/subscriptions/${item.id}`}
                    className="block truncate font-medium text-slate-900 hover:text-teal-700"
                  >
                    {item.name}
                  </Link>
                  {prompt.action === 'ENTER_AMOUNT' && (
                    <span className="block truncate text-xs text-amber-700">{prompt.message}</span>
                  )}
                </span>
                <span className="text-sm tabular-nums text-slate-600">
                  {formatMoney(item.price, item.currency)}
                  <span className="text-slate-400">{FREQUENCY_SUFFIX[item.frequency]}</span>
                </span>
                <ReviewActions item={item} onConfirm={actions.confirmReview} isConfirming={actions.isConfirmingReview} />
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
