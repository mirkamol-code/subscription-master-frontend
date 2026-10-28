import { useState } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import {
  useDeleteSubscription,
  usePauseSubscription,
  useResumeSubscription,
} from '@/hooks/use-subscriptions'
import { STATUS_ACTION } from '@/features/subscriptions/status-action'
import type { Subscription } from '@/types/api'

/** Pause/resume and delete with consistent feedback, plus the delete-confirmation state. */
export function useSubscriptionActions(options?: { onDeleted?: (item: Subscription) => void }) {
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null)
  const pauseMutation = usePauseSubscription()
  const resumeMutation = useResumeSubscription()
  const deleteMutation = useDeleteSubscription()

  const changeStatus = async (item: Subscription) => {
    const action = STATUS_ACTION[item.status]
    if (!action) return
    try {
      if (action === 'pause') {
        await pauseMutation.mutateAsync(item.id)
        toast.success(`${item.name} paused`)
      } else {
        await resumeMutation.mutateAsync(item.id)
        toast.success(`${item.name} is active again`)
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
    changeStatus: (item: Subscription) => void changeStatus(item),
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
    isChangingStatus: pauseMutation.isPending || resumeMutation.isPending,
  }
}
