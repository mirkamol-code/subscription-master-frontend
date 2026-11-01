interface RankedMerchant {
  activeSubscribers: number
}

export interface RankExtremes<T extends RankedMerchant> {
  top: T | null
  lowest: T | null
}

export function findRankExtremes<T extends RankedMerchant>(ranked: T[]): RankExtremes<T> {
  const top = ranked[0]
  const lowest = ranked.at(-1)
  if (!top || !lowest) return { top: null, lowest: null }
  if (top === lowest) return { top, lowest: null }
  if (top.activeSubscribers === lowest.activeSubscribers) return { top: null, lowest: null }
  return { top, lowest }
}

const oneDecimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

export function formatShare(percent: number) {
  return `${oneDecimal.format(percent)}%`
}

export function formatDecimal(value: number | null) {
  return value === null ? '—' : oneDecimal.format(value)
}
