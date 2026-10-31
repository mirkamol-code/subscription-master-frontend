import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { hasApiErrorCode } from '@/api/client'
import { gmailApi } from '@/api/endpoints/gmail'
import { describeSync } from '@/features/gmail/sync-status'
import { refreshSubscriptionData } from '@/hooks/use-subscriptions'
import type { GmailSyncStatus } from '@/types/api'

const SYNC_POLL_MS = 2_000

export const gmailKeys = {
  all: ['gmail'] as const,
  connection: () => [...gmailKeys.all, 'connection'] as const,
  syncStatus: () => [...gmailKeys.all, 'sync-status'] as const,
}

export function useGmailConnection() {
  return useQuery({ queryKey: gmailKeys.connection(), queryFn: gmailApi.getConnection })
}

export function useGmailAddress(): string | null {
  return useGmailConnection().data?.gmailAddress ?? null
}

function reloadSubscriptionsWhenSyncEnds(queryClient: QueryClient, previous: GmailSyncStatus | undefined, current: GmailSyncStatus) {
  if (previous?.state === 'RUNNING' && current.state !== 'RUNNING') refreshSubscriptionData(queryClient)
}

export function useSyncStatus(isEnabled: boolean) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: gmailKeys.syncStatus(),
    queryFn: async () => {
      const previous = queryClient.getQueryData<GmailSyncStatus>(gmailKeys.syncStatus())
      const status = await gmailApi.getSyncStatus()
      reloadSubscriptionsWhenSyncEnds(queryClient, previous, status)
      return status
    },
    enabled: isEnabled,
    refetchInterval: (query) => (query.state.data && describeSync(query.state.data).shouldPoll ? SYNC_POLL_MS : false),
  })
}

export function useRequestSync() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: gmailApi.requestSync,
    onSuccess: (status) => queryClient.setQueryData(gmailKeys.syncStatus(), status),
    onError: (error) => {
      if (hasApiErrorCode(error, 'SYNC_ALREADY_RUNNING')) void queryClient.invalidateQueries({ queryKey: gmailKeys.syncStatus() })
      if (hasApiErrorCode(error, 'GMAIL_RECONNECT_REQUIRED')) void queryClient.invalidateQueries({ queryKey: gmailKeys.all })
    },
  })
}
