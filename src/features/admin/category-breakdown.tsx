import { ErrorState } from '@/components/common/error-state'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { RANGE_LABEL } from '@/features/admin/analytics-range-label'
import { MagnitudeBarChart } from '@/features/admin/magnitude-bar-chart'
import { formatShare } from '@/features/admin/merchant-ranking'
import type { AnalyticsRange } from '@/features/admin/types'
import { useCategoryAnalytics } from '@/hooks/use-admin'
import { getCategoryMeta } from '@/lib/category-config'
import { cn, formatMoney } from '@/lib/utils'

interface CategoryBreakdownProps {
  range: AnalyticsRange
}

export function CategoryBreakdown({ range }: CategoryBreakdownProps) {
  const categoryQuery = useCategoryAnalytics(range)
  const categories = (categoryQuery.data ?? []).filter((row) => row.activeSubscriptions > 0)

  if (isForbiddenOrMissing(categoryQuery.error)) return null

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>By category</CardTitle>
          <CardDescription>Active subscribers per category, most to least tracked.</CardDescription>
        </div>
      </CardHeader>
      <div className={cn('space-y-4 p-6 pt-4 transition-opacity', categoryQuery.isPlaceholderData && 'opacity-60')}>
        {categoryQuery.isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : categoryQuery.isError ? (
          <ErrorState error={categoryQuery.error} onRetry={() => void categoryQuery.refetch()} />
        ) : categories.length === 0 ? (
          <p className="text-[13px] text-muted">No active subscriptions yet.</p>
        ) : (
          <>
            <MagnitudeBarChart
              ariaLabel="Active subscribers per category"
              bars={categories.map((row) => ({
                label: getCategoryMeta(row.category).label,
                value: row.activeSubscribers,
                summary: `${row.activeSubscribers} active subscribers · ${formatShare(row.sharePercent)} of active subscriptions`,
              }))}
            />
            <table className="w-full text-left text-[13px] tabular-nums">
              <caption className="sr-only">Categories ranked by active subscribers</caption>
              <thead className="text-muted">
                <tr>
                  <th scope="col" className="py-1.5 font-medium">Category</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Subscribers</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Share</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Spend, UZS ({RANGE_LABEL[range]})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((row) => (
                  <tr key={row.category}>
                    <td className="py-1.5 text-fg">{getCategoryMeta(row.category).label}</td>
                    <td className="py-1.5 text-right">{row.activeSubscribers}</td>
                    <td className="py-1.5 text-right">{formatShare(row.sharePercent)}</td>
                    <td className="whitespace-nowrap py-1.5 text-right">{formatMoney(row.trackedSpendUzs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Card>
  )
}
