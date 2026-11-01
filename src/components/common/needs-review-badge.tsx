import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function NeedsReviewBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn('bg-warning/10 text-warning', className)} title="Amount, currency or billing cycle was guessed">
      Needs review
    </Badge>
  )
}
