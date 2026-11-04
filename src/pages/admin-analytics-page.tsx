import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { RANGE_LABEL } from '@/features/admin/analytics-range-label'
import { AnalyticsRangeTabs } from '@/features/admin/analytics-range-tabs'
import { CategoryBreakdown } from '@/features/admin/category-breakdown'
import { MagnitudeBarChart } from '@/features/admin/magnitude-bar-chart'
import { findRankExtremes, formatShare } from '@/features/admin/merchant-ranking'
import { MerchantRankingTable } from '@/features/admin/merchant-ranking-table'
import { RankHighlights } from '@/features/admin/rank-highlights'
import { analyticsRanges, type AnalyticsRange } from '@/features/admin/types'
import { useSearchParamUpdater } from '@/features/admin/use-search-param-updater'
import { useMerchantAnalytics } from '@/hooks/use-admin'
import { getCategoryMeta } from '@/lib/category-config'
import { cn } from '@/lib/utils'
import { categories, type Category } from '@/types/api'
import { NotFoundPage } from '@/pages/not-found-page'

const DEFAULT_RANGE: AnalyticsRange = 'LAST_30_DAYS'
const CHART_LIMIT = 10

function readRange(value: string | null): AnalyticsRange {
  return analyticsRanges.find((range) => range === value) ?? DEFAULT_RANGE
}

function readCategory(value: string | null): Category | undefined {
  return categories.find((category) => category === value)
}

export function AdminAnalyticsPage() {
  const { searchParams, updateParams } = useSearchParamUpdater()
  const range = readRange(searchParams.get('range'))
  const category = readCategory(searchParams.get('category'))
  const merchantQuery = useMerchantAnalytics(range, category)

  if (isForbiddenOrMissing(merchantQuery.error)) return <NotFoundPage embedded />

  const merchants = merchantQuery.data ?? []
  const extremes = findRankExtremes(merchants)
  const shareScope = category ? `active ${getCategoryMeta(category).label} subscriptions` : 'active subscriptions'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant analytics"
        description="Ranked by active subscribers today. Cancellations, tracked spend and logins follow the date range; new subscriptions use fixed 7 and 30 day windows."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AnalyticsRangeTabs
          value={range}
          onChange={(next) => updateParams({ range: next === DEFAULT_RANGE ? '' : next }, true)}
        />
        <Select
          aria-label="Category"
          value={category ?? ''}
          onChange={(event) => updateParams({ category: event.target.value }, true)}
          wrapperClassName="sm:w-56"
        >
          <option value="">All categories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {getCategoryMeta(value).label}
            </option>
          ))}
        </Select>
      </div>

      {merchantQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : merchantQuery.isError ? (
        <ErrorState error={merchantQuery.error} onRetry={() => void merchantQuery.refetch()} />
      ) : merchants.length === 0 ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="No merchants yet"
            description={category ? 'Nothing is tracked in this category.' : 'Merchants appear once Users track a subscription.'}
          />
        </Card>
      ) : (
        <div
          aria-busy={merchantQuery.isPlaceholderData}
          className={cn('space-y-6 transition-opacity', merchantQuery.isPlaceholderData && 'opacity-60')}
        >
          <RankHighlights top={extremes.top} lowest={extremes.lowest} shareScope={shareScope} />
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active subscribers per merchant</CardTitle>
                <CardDescription>
                  Top {Math.min(CHART_LIMIT, merchants.length)} of {merchants.length} merchants.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="p-6 pt-4">
              <MagnitudeBarChart
                ariaLabel="Active subscribers per merchant"
                bars={merchants.slice(0, CHART_LIMIT).map((merchant) => ({
                  label: merchant.name,
                  value: merchant.activeSubscribers,
                  summary: `${merchant.activeSubscribers} active subscribers · ${formatShare(merchant.sharePercent)} of ${shareScope}`,
                }))}
              />
            </div>
          </Card>
          <MerchantRankingTable merchants={merchants} extremes={extremes} rangeLabel={RANGE_LABEL[range]} />
        </div>
      )}

      <CategoryBreakdown range={range} />
    </div>
  )
}
