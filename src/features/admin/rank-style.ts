import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'

export type RankPosition = 'top' | 'lowest'

interface RankStyle {
  label: string
  icon: LucideIcon
  toneClass: string
}

export const RANK_STYLE: Record<RankPosition, RankStyle> = {
  top: { label: 'Most tracked', icon: TrendingUp, toneClass: 'bg-accent/10 text-accent' },
  lowest: { label: 'Least tracked', icon: TrendingDown, toneClass: 'bg-fg/[0.06] text-muted' },
}
