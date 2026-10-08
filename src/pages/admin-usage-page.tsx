import axios from 'axios'
import { BarChart3, LockKeyhole } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ErrorState } from '@/components/common/error-state'
import { EmptyState } from '@/components/common/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminUsage } from '@/hooks/use-statistics'

export function AdminUsagePage() {
  const query = useAdminUsage()
  const forbidden = axios.isAxiosError(query.error) && query.error.response?.status === 403
  const max = Math.max(...(query.data?.map((item) => item.subscriptionCount) ?? [1]))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">Service usage</h2>
        <p className="mt-1 text-sm text-slate-500">
          Subscription counts grouped by service, provided by the admin API.
        </p>
      </div>

      {query.isLoading ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-12" />
            ))}
          </CardContent>
        </Card>
      ) : forbidden ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
            <LockKeyhole className="size-5" />
          </div>
          <h3 className="mt-4 font-bold text-slate-950">Admin access required</h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Your authenticated account does not have permission to view service-wide usage. Backend
            authorization remains authoritative.
          </p>
        </div>
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : !query.data?.length ? (
        <Card>
          <EmptyState title="No usage data" description="The admin API returned no service usage records." />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-teal-700" />
              <h3 className="font-bold text-slate-950">Subscriptions by service</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {query.data.map((item) => (
              <div key={item.serviceName}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{item.serviceName}</span>
                  <span className="font-bold text-slate-950">{item.subscriptionCount}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(item.subscriptionCount / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
