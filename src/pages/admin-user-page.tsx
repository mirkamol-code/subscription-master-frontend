import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, History, Layers } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { StatusBadge } from '@/components/common/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'
import { formatDateTime } from '@/features/admin/format-date-time'
import { formatLocation, getDeviceIcon, resolveLoginClient } from '@/features/admin/login-client'
import { Pager } from '@/features/admin/pager'
import { RoleBadge } from '@/features/admin/role-badge'
import { RoleControl } from '@/features/admin/role-control'
import { getDisplayName } from '@/features/admin/user-display-name'
import {
  useAdminUser,
  useAdminUserLogins,
  useAdminUserPayments,
  useAdminUserSubscriptions,
} from '@/hooks/use-admin'
import { FREQUENCY_SUFFIX } from '@/lib/labels'
import { formatDate, formatMoney } from '@/lib/utils'
import { NotFoundPage } from '@/pages/not-found-page'

function SectionSkeleton() {
  return <Skeleton className="m-6 h-32 rounded-xl" />
}

function LoginHistoryCard({ userId }: { userId: number }) {
  const [page, setPage] = useState(0)
  const query = useAdminUserLogins(userId, page)
  return (
    <Card>
      <CardHeader><CardTitle>Login history</CardTitle></CardHeader>
      {query.isLoading ? <SectionSkeleton /> : query.isError ? (
        <div className="p-6"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></div>
      ) : !query.data || query.data.empty ? (
        <EmptyState icon={History} title="No logins recorded" description="Logins are recorded from the admin release onwards." />
      ) : (
        <div className="space-y-4 p-6 pt-4">
          <ul className="divide-y divide-border text-sm">
            {query.data.content.map((login) => {
              const client = resolveLoginClient(login)
              const DeviceIcon = getDeviceIcon(client.device)
              const location = formatLocation(login.city, login.country)
              return (
                <li
                  key={login.id}
                  className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  title={login.userAgent ?? undefined}
                >
                  <div className="flex items-center gap-2">
                    <DeviceIcon className="size-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="font-medium text-fg">{formatDateTime(login.occurredAt)}</span>
                    {client.device !== 'Unknown' && (
                      <Badge className="bg-fg/[0.06] text-muted text-xs font-normal">
                        {client.device}
                      </Badge>
                    )}
                  </div>
                  <div className="truncate text-[13px] text-muted">
                    {location && (
                      <>
                        <span className="font-medium text-fg/80">{location}</span>
                        <span className="mx-1.5">·</span>
                      </>
                    )}
                    <span>{login.ip ?? 'Unknown IP'}</span>
                    <span className="mx-1.5">·</span>
                    <span>{client.summary}</span>
                  </div>
                </li>
              )
            })}
          </ul>
          <Pager page={query.data} label="Login history pages" onPageChange={setPage} />
        </div>
      )}
    </Card>
  )
}

function SubscriptionsCard({ userId }: { userId: number }) {
  const query = useAdminUserSubscriptions(userId)
  return (
    <Card>
      <CardHeader><CardTitle>Subscriptions</CardTitle></CardHeader>
      {query.isLoading ? <SectionSkeleton /> : query.isError ? (
        <div className="p-6"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></div>
      ) : !query.data || query.data.length === 0 ? (
        <EmptyState icon={Layers} title="No subscriptions" description="This user isn’t tracking anything yet." />
      ) : (
        <ul className="divide-y divide-border p-6 pt-2 text-sm">
          {query.data.map((subscription) => (
            <li key={subscription.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-fg">{subscription.name}</p>
                <p className="text-[13px] text-muted">
                  {formatMoney(subscription.price, subscription.currency)}{FREQUENCY_SUFFIX[subscription.frequency]} · next {formatDate(subscription.nextPaymentDate)}
                  {subscription.endsOn && ` · access ends ${formatDate(subscription.endsOn)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {subscription.deleted && <Badge className="bg-fg/[0.06] text-muted">Deleted</Badge>}
                {subscription.hidden && <Badge className="bg-fg/[0.06] text-muted">Hidden</Badge>}
                <StatusBadge status={subscription.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function PaymentsCard({ userId }: { userId: number }) {
  const [page, setPage] = useState(0)
  const query = useAdminUserPayments(userId, page)
  return (
    <Card>
      <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
      {query.isLoading ? <SectionSkeleton /> : query.isError ? (
        <div className="p-6"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></div>
      ) : !query.data || query.data.empty ? (
        <EmptyState icon={CreditCard} title="No payments recorded" description="Payments appear once receipts are synced or entered." />
      ) : (
        <div className="space-y-4 p-6 pt-2">
          <ul className="divide-y divide-border text-sm">
            {query.data.content.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">{payment.subscriptionName}</p>
                  <p className="text-[13px] text-muted">{formatDate(payment.paidOn)}</p>
                </div>
                <div className="text-right tabular-nums">
                  <p className="font-medium text-fg">{formatMoney(payment.amount, payment.currency)}</p>
                  {payment.currency !== 'UZS' && <p className="text-[13px] text-muted">{formatMoney(payment.amountUzs)}</p>}
                </div>
              </li>
            ))}
          </ul>
          <Pager page={query.data} label="Payment history pages" onPageChange={setPage} />
        </div>
      )}
    </Card>
  )
}

export function AdminUserPage() {
  const userId = Number(useParams().id)
  const userQuery = useAdminUser(userId)

  if (!Number.isInteger(userId) || userId <= 0 || isForbiddenOrMissing(userQuery.error)) return <NotFoundPage embedded />
  if (userQuery.isLoading) return <Skeleton className="h-48 rounded-3xl" />
  if (userQuery.isError || !userQuery.data)
    return <ErrorState error={userQuery.error} onRetry={() => void userQuery.refetch()} />

  const user = userQuery.data
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/admin"><ArrowLeft className="size-4" /> All users</Link>
      </Button>
      <PageHeader
        title={getDisplayName(user)}
        eyebrow={<RoleBadge role={user.role} />}
        description={
          <>
            {user.email} · signed up {formatDateTime(user.createdAt)} · last login {formatDateTime(user.lastLoginAt)} · {user.timeZone}
          </>
        }
        actions={<RoleControl user={user} />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionsCard userId={user.id} />
        <PaymentsCard userId={user.id} />
      </div>
      <LoginHistoryCard userId={user.id} />
    </div>
  )
}
