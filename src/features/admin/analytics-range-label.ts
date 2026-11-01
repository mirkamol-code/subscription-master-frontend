import type { AnalyticsRange } from '@/features/admin/types'

export const RANGE_LABEL: Record<AnalyticsRange, string> = {
  LAST_7_DAYS: '7 days',
  LAST_30_DAYS: '30 days',
  LAST_90_DAYS: '90 days',
  ALL_TIME: 'All time',
}
