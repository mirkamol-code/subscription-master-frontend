import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getReviewPrompt } from '@/features/subscriptions/review-prompt'
import type { Subscription } from '@/types/api'

interface ReviewActionsProps {
  item: Subscription
  onConfirm: (item: Subscription) => void
  isConfirming: boolean
  onEnterAmount?: () => void
  canEnterAmount?: boolean
}

export function ReviewActions({ item, onConfirm, isConfirming, onEnterAmount, canEnterAmount = true }: ReviewActionsProps) {
  if (getReviewPrompt(item).action === 'ENTER_AMOUNT') {
    return (
      <div className="flex shrink-0 gap-2">
        {onEnterAmount ? (
          <Button size="sm" variant="outline" onClick={onEnterAmount} disabled={!canEnterAmount}>
            Enter amount
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link to={`/subscriptions/${item.id}`}>Enter amount</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Button size="sm" variant="outline" onClick={() => onConfirm(item)} disabled={isConfirming}>
        {isConfirming ? 'Saving…' : 'Looks right'}
      </Button>
      <Button asChild size="sm" variant="ghost">
        <Link to={`/subscriptions/${item.id}/edit`}>Edit</Link>
      </Button>
    </div>
  )
}
