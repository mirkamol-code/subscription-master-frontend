import { RANGE_LABEL } from '@/features/admin/analytics-range-label'
import { cn } from '@/lib/utils'
import { analyticsRanges, type AnalyticsRange } from '@/features/admin/types'

interface AnalyticsRangeTabsProps {
  value: AnalyticsRange
  onChange: (range: AnalyticsRange) => void
}

export function AnalyticsRangeTabs({ value, onChange }: AnalyticsRangeTabsProps) {
  return (
    <div role="group" aria-label="Date range" className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-fg/10 p-1">
      {analyticsRanges.map((range) => (
        <button
          key={range}
          type="button"
          aria-pressed={value === range}
          onClick={() => onChange(range)}
          className={cn(
            'whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring',
            value === range ? 'bg-surface-raised text-fg shadow-sm ring-1 ring-border' : 'text-muted hover:text-fg',
          )}
        >
          {RANGE_LABEL[range]}
        </button>
      ))}
    </div>
  )
}
