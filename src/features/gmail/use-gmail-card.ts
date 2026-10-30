import { toast } from 'sonner'
import { getApiError, hasApiErrorCode } from '@/api/client'
import { describeGmailConnection } from '@/features/gmail/gmail-connection'
import { describeSync } from '@/features/gmail/sync-status'
import { useGmailConnection, useRequestSync, useSyncStatus } from '@/hooks/use-gmail'

export function useGmailCard() {
  const connection = useGmailConnection()
  const card = connection.data ? describeGmailConnection(connection.data) : undefined
  const syncStatus = useSyncStatus(!!card?.canSync)
  const sync = syncStatus.data ? describeSync(syncStatus.data) : undefined
  const requestSync = useRequestSync()

  const startSync = async () => {
    try {
      await requestSync.mutateAsync()
    } catch (error) {
      if (!hasApiErrorCode(error, 'SYNC_ALREADY_RUNNING')) toast.error(getApiError(error))
    }
  }

  return {
    connection,
    card,
    sync,
    startSync: () => void startSync(),
    isSyncing: requestSync.isPending || !!sync?.isRunning,
  }
}
