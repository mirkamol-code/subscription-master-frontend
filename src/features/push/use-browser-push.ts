import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { enablePushReminders } from '@/features/notifications/use-notifications'
import { readBrowserPushState, turnOffBrowserPush, turnOnBrowserPush } from '@/features/push/browser-push'

const pushStateKey = ['push', 'browser-state'] as const

function describePushError(error: unknown) {
  return error instanceof Error && !axios.isAxiosError(error) ? error.message : getApiError(error)
}

export function useBrowserPush() {
  const queryClient = useQueryClient()
  const state = useQuery({ queryKey: pushStateKey, queryFn: readBrowserPushState })

  const turnOn = useMutation({
    mutationFn: async () => {
      await turnOnBrowserPush()
      await enablePushReminders(queryClient)
    },
    onSuccess: () => toast.success('Browser notifications are on'),
    onError: (error) => toast.error(describePushError(error)),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: pushStateKey }),
  })

  const turnOff = useMutation({
    mutationFn: turnOffBrowserPush,
    onSuccess: () => toast.success('Browser notifications are off for this browser'),
    onError: (error) => toast.error(describePushError(error)),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: pushStateKey }),
  })

  return {
    state,
    turnOn: () => turnOn.mutate(),
    turnOff: () => turnOff.mutate(),
    isChanging: turnOn.isPending || turnOff.isPending,
  }
}
