import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { StatusBadge } from '@/components/common/status-badge'
import { Card } from '@/components/ui/card'
import { formatDateTime } from '@/features/admin/format-date-time'
import { RoleBadge } from '@/features/admin/role-badge'
import { getHeaderSort, type SortableColumn } from '@/features/admin/sortable-header'
import type { AdminUserRow } from '@/features/admin/types'
import { getDisplayName } from '@/features/admin/user-display-name'
import { cn } from '@/lib/utils'

interface UsersTableProps {
  users: AdminUserRow[]
  sort: string
  onSortChange: (sort: string) => void
  isRefreshing: boolean
}

interface SortableHeaderProps {
  column: SortableColumn
  label: string
  sort: string
  onSortChange: (sort: string) => void
}

const SORT_ICON = { ascending: ArrowUp, descending: ArrowDown, none: ArrowUpDown }

function SortableHeader({ column, label, sort, onSortChange }: SortableHeaderProps) {
  const { ariaSort, nextSort } = getHeaderSort(sort, column)
  const Icon = SORT_ICON[ariaSort]
  return (
    <th scope="col" aria-sort={ariaSort} className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSortChange(nextSort)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md uppercase outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring',
          ariaSort !== 'none' && 'text-fg',
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </th>
  )
}

function MerchantSummary({ user }: { user: AdminUserRow }) {
  if (user.merchantNames.length === 0) return <span className="text-muted">None</span>
  return (
    <span>
      {user.merchantNames.join(', ')}
      {user.activeSubscriptions > user.merchantNames.length && (
        <span className="text-muted"> · {user.activeSubscriptions} active</span>
      )}
    </span>
  )
}

function UserName({ user }: { user: AdminUserRow }) {
  return (
    <Link to={`/admin/users/${user.id}`} className="block min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="block truncate font-medium text-fg hover:underline">{getDisplayName(user)}</span>
      {user.displayName && <span className="block truncate text-[13px] text-muted">{user.email}</span>}
    </Link>
  )
}

function UrgentStatus({ user }: { user: AdminUserRow }) {
  return user.status ? <StatusBadge status={user.status} /> : <span className="text-muted">—</span>
}

export function UsersTable({ users, sort, onSortChange, isRefreshing }: UsersTableProps) {
  return (
    <div aria-busy={isRefreshing} className={cn('transition-opacity', isRefreshing && 'opacity-60')}>
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[12px] uppercase tracking-wide text-muted">
            <tr>
              <SortableHeader column="email" label="User" sort={sort} onSortChange={onSortChange} />
              <SortableHeader column="createdAt" label="Signed up" sort={sort} onSortChange={onSortChange} />
              <SortableHeader column="lastLoginAt" label="Last login" sort={sort} onSortChange={onSortChange} />
              <th scope="col" className="px-4 py-3 font-medium">Merchants</th>
              <th scope="col" className="px-4 py-3 font-medium">Most urgent status</th>
              <th scope="col" className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-fg/[0.02]">
                <td className="max-w-64 px-4 py-3"><UserName user={user} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(user.createdAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(user.lastLoginAt)}</td>
                <td className="max-w-64 px-4 py-3"><MerchantSummary user={user} /></td>
                <td className="px-4 py-3"><UrgentStatus user={user} /></td>
                <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-3 md:hidden">
        {users.map((user) => (
          <li key={user.id}>
            <Card className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <UserName user={user} />
                <RoleBadge role={user.role} />
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
                <dt className="text-muted">Signed up</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
                <dt className="text-muted">Last login</dt>
                <dd>{formatDateTime(user.lastLoginAt)}</dd>
                <dt className="text-muted">Merchants</dt>
                <dd><MerchantSummary user={user} /></dd>
                <dt className="text-muted">Most urgent</dt>
                <dd><UrgentStatus user={user} /></dd>
              </dl>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
