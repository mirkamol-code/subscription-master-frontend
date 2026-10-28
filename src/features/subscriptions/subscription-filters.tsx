import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { Select } from '@/components/ui/input'
import { CATEGORY_CONFIG } from '@/lib/category-config'
import { STATUS_LABEL } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { categories, currencies, subscriptionStatuses } from '@/types/api'
import { SORT_OPTIONS, type FilterValues } from '@/features/subscriptions/subscription-filter-options'

interface SubscriptionFiltersProps {
  values: FilterValues
  onChange: (key: keyof FilterValues, value: string) => void
  onClear: () => void
}

const STATUS_TABS = [{ value: '', label: 'All' }].concat(
  subscriptionStatuses.map((status) => ({ value: status, label: STATUS_LABEL[status] })),
)

export function SubscriptionFilters({ values, onChange, onClear }: SubscriptionFiltersProps) {
  const extraFilterCount = [values.category, values.currency, values.minPrice, values.maxPrice].filter(
    Boolean,
  ).length
  const [showMore, setShowMore] = useState(extraFilterCount > 0)
  const hasAnyFilter = extraFilterCount > 0 || Boolean(values.name || values.status)

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div
          role="tablist"
          aria-label="Filter by status"
          className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-slate-200/50 p-1"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={values.status === tab.value}
              onClick={() => onChange('status', tab.value)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all',
                values.status === tab.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <DebouncedInput
            type="search"
            aria-label="Search subscriptions"
            placeholder="Search by name"
            value={values.name}
            onCommit={(value) => onChange('name', value)}
            className="h-10 pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            aria-label="Sort by"
            value={values.sort}
            onChange={(event) => onChange('sort', event.target.value)}
            wrapperClassName="flex-1 lg:w-48 lg:flex-none"
            className="h-10"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            className="h-10"
            aria-expanded={showMore}
            onClick={() => setShowMore((open) => !open)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {extraFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-teal-600 text-[11px] text-white">
                {extraFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {showMore && (
        <div className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 animate-slide-up sm:grid-cols-2 lg:grid-cols-4">
          <Select
            aria-label="Category"
            value={values.category}
            onChange={(event) => onChange('category', event.target.value)}
            className="h-10"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_CONFIG[category].label}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Currency"
            value={values.currency}
            onChange={(event) => onChange('currency', event.target.value)}
            className="h-10"
          >
            <option value="">All currencies</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
          <DebouncedInput
            type="number"
            inputMode="decimal"
            min="0"
            aria-label="Minimum price"
            placeholder="Min price"
            value={values.minPrice}
            onCommit={(value) => onChange('minPrice', value)}
            className="h-10"
          />
          <DebouncedInput
            type="number"
            inputMode="decimal"
            min="0"
            aria-label="Maximum price"
            placeholder="Max price"
            value={values.maxPrice}
            onCommit={(value) => onChange('maxPrice', value)}
            className="h-10"
          />
        </div>
      )}

      {hasAnyFilter && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-slate-900"
        >
          <X className="size-3.5" /> Clear filters
        </button>
      )}
    </div>
  )
}
