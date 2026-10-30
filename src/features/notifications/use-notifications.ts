import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/endpoints/notifications'

const INBOX_SIZE = 20
const UNREAD_POLL_MS = 60_000

export const notificationKeys = {
  all: ['notifications'] as const,
  inbox: () => [...notificationKeys.all, 'inbox'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
}

export function useNotifications(isEnabled: boolean) {
  return useQuery({
    queryKey: notificationKeys.inbox(),
    queryFn: () => notificationsApi.list(0, INBOX_SIZE),
    enabled: isEnabled,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: UNREAD_POLL_MS,
  })
}

function useInboxMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.inbox() })
      void queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
  })
}

export function useMarkNotificationRead() {
  return useInboxMutation(notificationsApi.markRead)
}

export function useMarkAllNotificationsRead() {
  return useInboxMutation(() => notificationsApi.markAllRead())
}

export async function enablePushReminders(queryClient: QueryClient) {
  const settings = await queryClient.fetchQuery({
    queryKey: notificationKeys.settings(),
    queryFn: notificationsApi.getSettings,
  })
  if (settings.pushEnabled) return
  const saved = await notificationsApi.updateSettings({ ...settings, pushEnabled: true })
  queryClient.setQueryData(notificationKeys.settings(), saved)
}

export function useNotificationSettings() {
  return useQuery({ queryKey: notificationKeys.settings(), queryFn: notificationsApi.getSettings })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.updateSettings,
    onSuccess: (settings) => queryClient.setQueryData(notificationKeys.settings(), settings),
  })
}
