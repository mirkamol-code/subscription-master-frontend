import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionForm } from '@/features/subscriptions/subscription-form'
import { useCreateSubscription, useSubscription, useUpdateSubscription } from '@/hooks/use-subscriptions'
import type { SubscriptionValues } from '@/schemas/subscription'

export function SubscriptionFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const isEdit = mode === 'edit'

  const subscription = useSubscription(isEdit ? id : Number.NaN)
  const createMutation = useCreateSubscription()
  const updateMutation = useUpdateSubscription(id)
  const mutation = isEdit ? updateMutation : createMutation
  const backHref = isEdit ? `/subscriptions/${id}` : '/subscriptions'

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-3 text-slate-500">
      <Link to={backHref}>
        <ArrowLeft className="size-4" /> Back
      </Link>
    </Button>
  )

  if (isEdit && subscription.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[34rem] rounded-2xl" />
      </div>
    )
  }

  if (isEdit && !subscription.data) {
    return (
      <div className="space-y-6">
        {backLink}
        <ErrorState
          title="Subscription not found"
          error={subscription.error}
          onRetry={Number.isFinite(id) ? () => void subscription.refetch() : undefined}
        />
      </div>
    )
  }

  const handleSubmit = async (values: SubscriptionValues) => {
    setServerError('')
    try {
      const saved = await mutation.mutateAsync(
        isEdit ? { ...values, version: subscription.data?.version } : values,
      )
      toast.success(isEdit ? 'Changes saved' : `${values.name} added`)
      navigate(`/subscriptions/${saved.id}`)
    } catch (error) {
      setServerError(getApiError(error))
    }
  }

  return (
    <div className="space-y-6">
      {backLink}
      <PageHeader
        title={isEdit ? `Edit ${subscription.data?.name}` : 'New subscription'}
        description={
          isEdit ? 'Update the price, billing or status.' : 'Add a service you pay for regularly.'
        }
      />
      <SubscriptionForm
        key={subscription.data?.id ?? 'new'}
        initialValues={subscription.data}
        onSubmit={handleSubmit}
        pending={mutation.isPending}
        submitLabel={isEdit ? 'Save changes' : 'Add subscription'}
        cancelHref={backHref}
        serverError={serverError}
      />
    </div>
  )
}
