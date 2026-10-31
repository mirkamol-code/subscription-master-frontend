import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getApiError, getFieldErrors } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionForm } from '@/features/subscriptions/subscription-form'
import { useSubscription, useUpdateSubscription } from '@/hooks/use-subscriptions'
import type { SubscriptionValues } from '@/schemas/subscription'

export function SubscriptionFormPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const subscription = useSubscription(id)
  const mutation = useUpdateSubscription(id)
  const backHref = `/subscriptions/${id}`

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-3 text-slate-500">
      <Link to={backHref}>
        <ArrowLeft className="size-4" /> Back
      </Link>
    </Button>
  )

  if (subscription.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[34rem] rounded-2xl" />
      </div>
    )
  }

  if (!subscription.data) {
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
      const saved = await mutation.mutateAsync({ ...values, version: subscription.data?.version })
      toast.success('Changes saved')
      navigate(`/subscriptions/${saved.id}`)
    } catch (error) {
      setServerError(getApiError(error))
      return getFieldErrors(error)
    }
  }

  return (
    <div className="space-y-6">
      {backLink}
      <PageHeader
        title={`Edit ${subscription.data.name}`}
        description="Update the price, billing or status."
      />
      <SubscriptionForm
        key={subscription.data.id}
        initialValues={subscription.data}
        onSubmit={handleSubmit}
        pending={mutation.isPending}
        submitLabel="Save changes"
        cancelHref={backHref}
        serverError={serverError}
      />
    </div>
  )
}
