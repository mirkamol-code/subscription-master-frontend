import { api } from '@/api/client'
import type { GmailConnection, GmailSyncStatus } from '@/types/api'

export const gmailApi = {
  getConnection: async () => (await api.get<GmailConnection>('/me/gmail')).data,
  requestSync: async () => (await api.post<GmailSyncStatus>('/gmail/sync')).data,
  getSyncStatus: async () => (await api.get<GmailSyncStatus>('/gmail/sync-status')).data,
}
