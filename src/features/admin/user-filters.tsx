import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { Select } from '@/components/ui/input'
import { STATUS_LABEL } from '@/lib/labels'
import { subscriptionStatuses } from '@/types/api'
import { useMerchantOptions } from '@/hooks/use-admin'
import {
  JOINED_OPTIONS,
  LOGGED_IN_OPTIONS,
  USER_SORT_OPTIONS,
  type UserListFilters,
} from '@/features/admin/user-list-query'

export type UserFilterKey = Exclude<keyof UserListFilters, 'page'>

interface UserFiltersProps {
  filters: UserListFilters
  onChange: (key: UserFilterKey, value: string) => void
  onClear: () => void
  hasFilters: boolean
}

export function UserFilters({ filters, onChange, onClear, hasFilters }: UserFiltersProps) {
  const merchants = useMerchantOptions()

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <DebouncedInput
          type="search"
          aria-label="Search users"
          placeholder="Search by name or email"
          value={filters.search}
          onCommit={(value) => onChange('search', value)}
          className="h-10 pl-10"
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Select aria-label="Joined" value={filters.joined} onChange={(e) => onChange('joined', e.target.value)}>
          {JOINED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select aria-label="Last login" value={filters.loggedIn} onChange={(e) => onChange('loggedIn', e.target.value)}>
          {LOGGED_IN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select aria-label="Subscription status" value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">Any status</option>
          {subscriptionStatuses.map((status) => (
            <option key={status} value={status}>
              Has {STATUS_LABEL[status].toLowerCase()}
            </option>
          ))}
        </Select>
        <Select aria-label="Merchant" value={filters.merchant} onChange={(e) => onChange('merchant', e.target.value)}>
          <option value="">Any merchant</option>
          {(merchants.data ?? []).map((merchant) => (
            <option key={merchant.slug} value={merchant.slug}>
              {merchant.name}
            </option>
          ))}
        </Select>
        <Select aria-label="Sort users" value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          {USER_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
