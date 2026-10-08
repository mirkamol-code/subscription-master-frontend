import type { ElementType } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Pencil, Repeat2, Tag, Trash2, WalletCards } from 'lucide-react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteSubscription, useSubscription } from '@/hooks/use-subscriptions'
import { formatDate, formatMoney, humanize } from '@/lib/utils'

export function SubscriptionDetailPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const query = useSubscription(id)
  const remove = useDeleteSubscription()

  if (query.isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-80" />
      </div>
    )
  if (query.isError || !query.data)
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />

  const item = query.data

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(id)
      toast.success(`${item.name} was deleted`)
      navigate('/subscriptions')
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/subscriptions">
          <ArrowLeft className="size-4" /> Back to subscriptions
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">{item.name}</h2>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500">Subscription #{item.id}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/subscriptions/${id}/edit`}>
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-950">Billing details</h3>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <Detail icon={WalletCards} label="Price" value={formatMoney(item.price, item.currency)} />
            <Detail icon={Repeat2} label="Frequency" value={humanize(item.frequency)} />
            <Detail icon={Tag} label="Category" value={humanize(item.category)} />
            <Detail icon={Calendar} label="Started" value={formatDate(item.startDate)} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-slate-950 p-6 text-white">
            <p className="text-sm font-medium text-teal-300">Next payment</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatDate(item.nextPaymentDate)}</p>
            <p className="mt-2 text-sm text-slate-400">
              {formatMoney(item.price, item.currency)} · {humanize(item.frequency)}
            </p>
          </div>
          <CardContent>
            <p className="text-sm leading-6 text-slate-500">
              The next payment date is calculated by the backend from the subscription start date
              and billing frequency.
            </p>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete subscription?"
        description={`This permanently deletes ${item.name}. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        pending={remove.isPending}
      />
    </div>
  )
}

function Detail({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
