import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionForm } from '@/features/subscriptions/subscription-form'
import { useCreateSubscription, useSubscription, useUpdateSubscription } from '@/hooks/use-subscriptions'
import type { SubscriptionValues } from '@/schemas/subscription'

export function SubscriptionFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  // useSubscription is disabled (via Number.NaN) when in create mode.
  // useUpdateSubscription must always be called (Rules of Hooks); it is only invoked in edit mode.
  const subscription = useSubscription(mode === 'edit' ? id : Number.NaN)
  const createMutation = useCreateSubscription()
  const updateMutation = useUpdateSubscription(id)
  const mutation = mode === 'create' ? createMutation : updateMutation

  if (mode === 'edit' && subscription.isLoading) return <Skeleton className="h-[32rem] max-w-3xl" />
  if (mode === 'edit' && subscription.isError)
    return <ErrorState error={subscription.error} onRetry={() => void subscription.refetch()} />

  const handleSubmit = async (values: SubscriptionValues) => {
    setServerError('')
    try {
      const result = await mutation.mutateAsync(values)
      toast.success(mode === 'create' ? 'Subscription added' : 'Subscription updated')
      navigate(`/subscriptions/${result.id}`)
    } catch (error) {
      setServerError(getApiError(error))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {mode === 'create' ? 'Add a subscription' : `Edit ${subscription.data?.name}`}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'create'
            ? 'Add the billing details used to calculate renewals and spending.'
            : 'Update billing details and status.'}
        </p>
      </div>
      <SubscriptionForm
        initialValues={subscription.data}
        onSubmit={handleSubmit}
        pending={mutation.isPending}
        submitLabel={mode === 'create' ? 'Add subscription' : 'Save changes'}
        serverError={serverError}
      />
    </div>
  )
}
