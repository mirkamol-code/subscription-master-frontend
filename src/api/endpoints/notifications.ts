import { api } from '@/api/client'
import type { AppNotification, NotificationSettings, Page } from '@/types/api'

export const notificationsApi = {
  list: async (page: number, size: number) =>
    (await api.get<Page<AppNotification>>('/notifications', { params: { page, size } })).data,
  getUnreadCount: async () => (await api.get<{ count: number }>('/notifications/unread-count')).data.count,
  markRead: async (id: number) => (await api.post<AppNotification>(`/notifications/${id}/read`)).data,
  markAllRead: async () => (await api.post<{ updated: number }>('/notifications/read-all')).data,
  getSettings: async () => (await api.get<NotificationSettings>('/settings/notifications')).data,
  updateSettings: async (settings: NotificationSettings) =>
    (await api.put<NotificationSettings>('/settings/notifications', settings)).data,
}
