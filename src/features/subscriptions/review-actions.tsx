import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { Subscription } from '@/types/api'

interface ReviewActionsProps {
  item: Subscription
  onConfirm: (item: Subscription) => void
  isConfirming: boolean
}

export function ReviewActions({ item, onConfirm, isConfirming }: ReviewActionsProps) {
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
