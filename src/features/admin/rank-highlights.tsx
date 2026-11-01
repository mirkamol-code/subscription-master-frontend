import { Card } from '@/components/ui/card'
import { formatShare } from '@/features/admin/merchant-ranking'
import { RANK_STYLE, type RankPosition } from '@/features/admin/rank-style'
import type { MerchantAnalytics } from '@/features/admin/types'
import { cn } from '@/lib/utils'

interface HighlightCardProps {
  position: RankPosition
  merchant: MerchantAnalytics
  shareScope: string
}

function HighlightCard({ position, merchant, shareScope }: HighlightCardProps) {
  const { label, icon: Icon, toneClass } = RANK_STYLE[position]
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-full', toneClass)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        <p className="truncate text-lg font-semibold text-fg">{merchant.name}</p>
        <p className="text-[13px] text-muted">
          {merchant.activeSubscribers} active subscribers · {formatShare(merchant.sharePercent)} of {shareScope}
        </p>
      </div>
    </Card>
  )
}

interface RankHighlightsProps {
  top: MerchantAnalytics | null
  lowest: MerchantAnalytics | null
  shareScope: string
}

export function RankHighlights({ top, lowest, shareScope }: RankHighlightsProps) {
  if (!top && !lowest) return null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {top && <HighlightCard position="top" merchant={top} shareScope={shareScope} />}
      {lowest && <HighlightCard position="lowest" merchant={lowest} shareScope={shareScope} />}
    </div>
  )
}
