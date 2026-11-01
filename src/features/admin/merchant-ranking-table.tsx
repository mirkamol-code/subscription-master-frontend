import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDecimal, formatShare, type RankExtremes } from '@/features/admin/merchant-ranking'
import { RANK_STYLE, type RankPosition } from '@/features/admin/rank-style'
import type { MerchantAnalytics } from '@/features/admin/types'
import { cn, formatMoney } from '@/lib/utils'

interface MerchantRankingTableProps {
  merchants: MerchantAnalytics[]
  extremes: RankExtremes<MerchantAnalytics>
  rangeLabel: string
}

interface RankBadgeProps {
  position: RankPosition | null
}

function formatOptionalMoney(value: number | null) {
  return value === null ? '—' : formatMoney(value)
}

function findPosition(merchant: MerchantAnalytics, extremes: RankExtremes<MerchantAnalytics>): RankPosition | null {
  if (merchant === extremes.top) return 'top'
  if (merchant === extremes.lowest) return 'lowest'
  return null
}

function RankBadge({ position }: RankBadgeProps) {
  if (!position) return null
  const { label, icon: Icon, toneClass } = RANK_STYLE[position]
  return (
    <Badge className={toneClass}>
      <Icon className="size-3" /> {label}
    </Badge>
  )
}

export function MerchantRankingTable({ merchants, extremes, rangeLabel }: MerchantRankingTableProps) {
  return (
    <>
      <Card className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Merchants ranked by active subscribers</caption>
          <thead className="border-b border-border text-[12px] uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">#</th>
              <th scope="col" className="px-4 py-3 font-medium">Merchant</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Active subscribers</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Share</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">New 7d</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">New 30d</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Cancelled ({rangeLabel})</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Total tracked spend, UZS ({rangeLabel})</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Avg per paying user, UZS</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Logins per user ({rangeLabel})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border tabular-nums">
            {merchants.map((merchant) => {
              const position = findPosition(merchant, extremes)
              return (
                <tr key={merchant.slug} className={cn(position && 'bg-fg/[0.02]')}>
                  <td className="px-4 py-3 text-muted">{merchant.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-fg">{merchant.name}</span>
                      <RankBadge position={position} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-fg">{merchant.activeSubscribers}</td>
                  <td className="px-4 py-3 text-right">{formatShare(merchant.sharePercent)}</td>
                  <td className="px-4 py-3 text-right">{merchant.newLast7Days}</td>
                  <td className="px-4 py-3 text-right">{merchant.newLast30Days}</td>
                  <td className="px-4 py-3 text-right">{merchant.cancelledInRange}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">{formatMoney(merchant.trackedSpendUzs)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">{formatOptionalMoney(merchant.averageSpendPerUserUzs)}</td>
                  <td className="px-4 py-3 text-right">{formatDecimal(merchant.loginsPerUser)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <ol className="space-y-3 lg:hidden">
        {merchants.map((merchant) => (
          <li key={merchant.slug}>
            <Card className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] text-muted">#{merchant.rank}</span>
                <span className="font-medium text-fg">{merchant.name}</span>
                <RankBadge position={findPosition(merchant, extremes)} />
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] tabular-nums">
                <dt className="text-muted">Active subscribers</dt>
                <dd>{merchant.activeSubscribers} ({formatShare(merchant.sharePercent)})</dd>
                <dt className="text-muted">New 7d / 30d</dt>
                <dd>{merchant.newLast7Days} / {merchant.newLast30Days}</dd>
                <dt className="text-muted">Cancelled ({rangeLabel})</dt>
                <dd>{merchant.cancelledInRange}</dd>
                <dt className="text-muted">Tracked spend ({rangeLabel})</dt>
                <dd>{formatMoney(merchant.trackedSpendUzs)}</dd>
                <dt className="text-muted">Avg per paying user</dt>
                <dd>{formatOptionalMoney(merchant.averageSpendPerUserUzs)}</dd>
                <dt className="text-muted">Logins per user</dt>
                <dd>{formatDecimal(merchant.loginsPerUser)}</dd>
              </dl>
            </Card>
          </li>
        ))}
      </ol>
    </>
  )
}
