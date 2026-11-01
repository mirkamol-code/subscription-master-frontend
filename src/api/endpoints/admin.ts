import { api } from '@/api/client'
import type { Page } from '@/types/api'
import type {
  AdminOverview,
  AdminPayment,
  AdminRole,
  AdminSubscription,
  AdminUser,
  AdminUserListParams,
  AdminUserRow,
  LoginEvent,
  MerchantOption,
} from '@/features/admin/types'

const HISTORY_PAGE_SIZE = 10

export const adminApi = {
  overview: async () => (await api.get<AdminOverview>('/admin/overview')).data,
  users: async (params: AdminUserListParams) =>
    (await api.get<Page<AdminUserRow>>('/admin/users', { params })).data,
  user: async (id: number) => (await api.get<AdminUser>(`/admin/users/${id}`)).data,
  logins: async (id: number, page: number) =>
    (await api.get<Page<LoginEvent>>(`/admin/users/${id}/logins`, { params: { page, size: HISTORY_PAGE_SIZE } })).data,
  subscriptions: async (id: number) =>
    (await api.get<AdminSubscription[]>(`/admin/users/${id}/subscriptions`)).data,
  payments: async (id: number, page: number) =>
    (await api.get<Page<AdminPayment>>(`/admin/users/${id}/payments`, { params: { page, size: HISTORY_PAGE_SIZE } })).data,
  changeRole: async (id: number, role: AdminRole) =>
    (await api.put<AdminUser>(`/admin/users/${id}/role`, { role })).data,
  merchants: async () => (await api.get<MerchantOption[]>('/admin/merchants')).data,
}
