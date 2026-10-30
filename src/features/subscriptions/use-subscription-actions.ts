import { useState } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import {
  useChangeSubscriptionStatus,
  useConfirmGuessedDetails,
  useDeleteSubscription,
  useSetSubscriptionHidden,
} from '@/hooks/use-subscriptions'
import { STATUS_CHOICE_UI } from '@/features/subscriptions/status-choice-ui'
import type { UserStatus } from '@/features/subscriptions/status-choices'
import type { Subscription } from '@/types/api'

/** Status changes, hiding and delete with consistent feedback, plus the delete-confirmation state. */
export function useSubscriptionActions(options?: { onDeleted?: (item: Subscription) => void }) {
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null)
  const statusMutation = useChangeSubscriptionStatus()
  const deleteMutation = useDeleteSubscription()
  const hiddenMutation = useSetSubscriptionHidden()
  const reviewMutation = useConfirmGuessedDetails()

  const changeStatus = async (item: Subscription, status: UserStatus) => {
    try {
      await statusMutation.mutateAsync({ id: item.id, status })
      toast.success(STATUS_CHOICE_UI[status].doneMessage(item.name))
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  const confirmReview = async (item: Subscription) => {
    try {
      await reviewMutation.mutateAsync(item)
      toast.success(`${item.name} confirmed`)
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  const setHidden = async (item: Subscription, hidden: boolean) => {
    try {
      await hiddenMutation.mutateAsync({ id: item.id, hidden })
      if (hidden) {
        toast.success(`${item.name} hidden`, {
          description: 'It stays hidden through every later Sync.',
          action: { label: 'Undo', onClick: () => void setHidden(item, false) },
        })
      } else {
        toast.success(`${item.name} is back in your list`)
      }
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success(`${deleteTarget.name} deleted`)
      options?.onDeleted?.(deleteTarget)
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return {
    changeStatus: (item: Subscription, status: UserStatus) => void changeStatus(item, status),
    toggleHidden: (item: Subscription) => void setHidden(item, !item.hidden),
    confirmReview: (item: Subscription) => void confirmReview(item),
    isConfirmingReview: reviewMutation.isPending,
    requestDelete: setDeleteTarget,
    deleteDialog: {
      open: deleteTarget !== null,
      onOpenChange: (open: boolean) => {
        if (!open && !deleteMutation.isPending) setDeleteTarget(null)
      },
      title: `Delete ${deleteTarget?.name ?? 'subscription'}?`,
      description: 'It will be removed from your list, totals and reports. This can’t be undone.',
      confirmLabel: 'Delete',
      pendingLabel: 'Deleting…',
      onConfirm: () => void confirmDelete(),
      pending: deleteMutation.isPending,
    },
    isChangingStatus: statusMutation.isPending,
  }
}
