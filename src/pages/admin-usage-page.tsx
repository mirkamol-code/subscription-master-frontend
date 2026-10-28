import axios from 'axios'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminUsage } from '@/hooks/use-statistics'
import { NotFoundPage } from '@/pages/not-found-page'

export function AdminUsagePage() {
  const query = useAdminUsage()
  const isForbidden = axios.isAxiosError(query.error) && query.error.response?.status === 403

  if (isForbidden) return <NotFoundPage embedded />

  const services = [...(query.data ?? [])].sort((a, b) => b.subscriptionCount - a.subscriptionCount)
  const total = services.reduce((sum, item) => sum + item.subscriptionCount, 0)
  const max = services[0]?.subscriptionCount || 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Popular services"
        description="What people across Subscription Master subscribe to most."
      />

      {query.isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <Skeleton key={n} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : services.length === 0 ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="Nothing to show yet"
            description="Popular services will appear once people start adding subscriptions."
          />
        </Card>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-3">
            <SummaryStat label="Subscriptions tracked" value={total.toLocaleString('en-US')} />
            <SummaryStat label="Different services" value={services.length.toLocaleString('en-US')} />
            <SummaryStat label="Most popular" value={services[0].serviceName} />
          </dl>

          <Card className="p-2">
            <ol>
              {services.map((service, index) => (
                <li key={service.serviceName} className="flex items-center gap-4 rounded-xl px-4 py-3">
                  <span className="w-6 text-right text-sm tabular-nums text-slate-400">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-medium text-slate-900">{service.serviceName}</span>
                      <span className="shrink-0 text-sm tabular-nums text-slate-500">
                        {service.subscriptionCount.toLocaleString('en-US')}
                        <span className="ml-2 text-xs text-slate-400">
                          {Math.round((service.subscriptionCount / (total || 1)) * 100)}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${(service.subscriptionCount / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </>
      )}
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <dt className="text-[13px] text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900">{value}</dd>
    </Card>
  )
}
