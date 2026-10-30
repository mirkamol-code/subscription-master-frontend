import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function NeedsReviewBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn('bg-amber-50 text-amber-700', className)} title="Amount, currency or billing cycle was guessed">
      Needs review
    </Badge>
  )
}
