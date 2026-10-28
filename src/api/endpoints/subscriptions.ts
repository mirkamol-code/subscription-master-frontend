import { api } from '@/api/client'
import type {
  Page,
  PaymentHistory,
  Subscription,
  SubscriptionFilters,
  SubscriptionRequest,
} from '@/types/api'

export const subscriptionsApi = {
  list: async (filters: SubscriptionFilters) =>
    (await api.get<Page<Subscription>>('/subscriptions', { params: filters })).data,
  listAll: async () => (await api.get<Subscription[]>('/subscriptions/all')).data,
  get: async (id: number) => (await api.get<Subscription>(`/subscriptions/${id}`)).data,
  create: async (input: SubscriptionRequest) =>
    (await api.post<Subscription>('/subscriptions', input)).data,
  update: async (id: number, input: SubscriptionRequest) =>
    (await api.put<Subscription>(`/subscriptions/${id}`, input)).data,
  remove: async (id: number) => {
    await api.delete(`/subscriptions/${id}`)
  },
  pause: async (id: number) =>
    (await api.post<Subscription>(`/subscriptions/${id}/pause`)).data,
  resume: async (id: number) =>
    (await api.post<Subscription>(`/subscriptions/${id}/resume`)).data,
  getHistory: async (id: number) =>
    (await api.get<PaymentHistory[]>(`/subscriptions/${id}/history`)).data,
}
