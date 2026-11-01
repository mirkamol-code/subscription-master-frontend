import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { OverviewCards } from '@/features/admin/overview-cards'
import { Pager } from '@/features/admin/pager'
import { UserFilters, type UserFilterKey } from '@/features/admin/user-filters'
import { DEFAULT_USER_SORT, readUserListFilters, toUserListParams } from '@/features/admin/user-list-query'
import { UsersTable } from '@/features/admin/users-table'
import { useAdminUsers } from '@/hooks/use-admin'
import { NotFoundPage } from '@/pages/not-found-page'

export function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readUserListFilters(searchParams)
  const usersQuery = useAdminUsers(toUserListParams(filters))

  const updateParams = (changes: Record<string, string>, replace = false) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace },
    )

  const changeFilter = (key: UserFilterKey, value: string) =>
    updateParams({ [key]: key === 'sort' && value === DEFAULT_USER_SORT ? '' : value, page: '' }, true)

  const hasFilters = Boolean(filters.search || filters.joined || filters.loggedIn || filters.status || filters.merchant)
  const usersPage = usersQuery.data
  const lastPage = Math.max((usersPage?.totalPages ?? 1) - 1, 0)

  useEffect(() => {
    if (!usersPage || filters.page <= lastPage) return
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (lastPage) next.set('page', String(lastPage))
        else next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [usersPage, filters.page, lastPage, setSearchParams])

  if (isForbiddenOrMissing(usersQuery.error)) return <NotFoundPage embedded />

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Signups, logins and subscriptions across Subscription Master." />

      <OverviewCards />

      <section aria-labelledby="users-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="users-heading" className="text-lg font-semibold tracking-tight text-fg">Users</h2>
          {usersPage && <p className="text-[13px] text-muted">{usersPage.totalElements} total</p>}
        </div>

        <UserFilters
          filters={filters}
          onChange={changeFilter}
          onClear={() => setSearchParams({}, { replace: true })}
          hasFilters={hasFilters}
        />

        {usersQuery.isLoading ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : usersQuery.isError ? (
          <ErrorState error={usersQuery.error} onRetry={() => void usersQuery.refetch()} />
        ) : !usersPage || usersPage.empty ? (
          <Card>
            <EmptyState
              icon={Users}
              title={hasFilters ? 'No users match these filters' : 'No users yet'}
              description={hasFilters ? 'Try a wider date range or clear the filters.' : 'People appear here after their first sign-in.'}
            />
          </Card>
        ) : (
          <>
            <UsersTable
              users={usersPage.content}
              sort={filters.sort}
              onSortChange={(sort) => changeFilter('sort', sort)}
              isRefreshing={usersQuery.isPlaceholderData}
            />
            <Pager
              page={usersPage}
              label="Users pages"
              onPageChange={(page) => updateParams({ page: page > 0 ? String(page) : '' })}
            />
          </>
        )}
      </section>
    </div>
  )
}
