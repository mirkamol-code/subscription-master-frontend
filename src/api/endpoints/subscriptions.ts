import { api } from '@/api/client'
import type {
  Page,
  PaymentHistory,
  StatusChange,
  Subscription,
  SubscriptionFilters,
  SubscriptionRequest,
  SubscriptionStatus,
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
  changeStatus: async (id: number, status: SubscriptionStatus) =>
    (await api.put<Subscription>(`/subscriptions/${id}/status`, { status })).data,
  hide: async (id: number) => (await api.post<Subscription>(`/subscriptions/${id}/hide`)).data,
  unhide: async (id: number) => (await api.post<Subscription>(`/subscriptions/${id}/unhide`)).data,
  getStatusHistory: async (id: number) =>
    (await api.get<StatusChange[]>(`/subscriptions/${id}/status-history`)).data,
  getHistory: async (id: number) =>
    (await api.get<PaymentHistory[]>(`/subscriptions/${id}/history`)).data,
}
