import { api } from '@/api/client'
import type { PushSubscriptionRequest } from '@/features/push/push-keys'

export const pushApi = {
  getVapidPublicKey: async () => (await api.get<{ publicKey: string }>('/push/vapid-public-key')).data.publicKey,
  subscribe: async (request: PushSubscriptionRequest) => {
    await api.post('/push/subscriptions', request)
  },
  unsubscribe: async (endpoint: string) => {
    await api.delete('/push/subscriptions', { data: { endpoint } })
  },
}
