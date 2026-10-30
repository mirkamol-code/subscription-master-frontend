import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, CheckCheck, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { getNotificationTarget } from '@/features/notifications/notification-target'
import { formatUnreadCount } from '@/features/notifications/unread-count'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from '@/features/notifications/use-notifications'
import { cn, formatInstant } from '@/lib/utils'
import type { AppNotification } from '@/types/api'

function useNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const unread = useUnreadCount()
  const inbox = useNotifications(isOpen)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const openNotification = (notification: AppNotification) => {
    if (!notification.read) markRead.mutate(notification.id)
    const target = getNotificationTarget(notification, window.location.origin)
    if (target) navigate(target)
  }

  const readAll = async () => {
    try {
      await markAllRead.mutateAsync(undefined)
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return {
    isOpen,
    setIsOpen,
    badge: formatUnreadCount(unread.data ?? 0),
    unreadCount: unread.data ?? 0,
    inbox,
    openNotification,
    readAll: () => void readAll(),
    isReadingAll: markAllRead.isPending,
  }
}

export function NotificationBell() {
  const bell = useNotificationBell()
  const notifications = bell.inbox.data?.content ?? []

  return (
    <DropdownMenu.Root open={bell.isOpen} onOpenChange={bell.setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={bell.unreadCount ? `Notifications, ${bell.unreadCount} unread` : 'Notifications'}
          className="relative grid size-9 place-items-center rounded-xl text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500/60"
        >
          <Bell className="size-5" />
          {bell.badge && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {bell.badge}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-pop-in"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-slate-900">Notifications</span>
            {bell.unreadCount > 0 && (
              <button
                type="button"
                onClick={bell.readAll}
                disabled={bell.isReadingAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline disabled:opacity-50"
              >
                <CheckCheck className="size-3.5" aria-hidden /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {bell.inbox.isLoading ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : bell.inbox.isError ? (
              <ErrorState bare error={bell.inbox.error} onRetry={() => void bell.inbox.refetch()} />
            ) : !notifications.length ? (
              <p className="px-3 py-6 text-center text-sm text-slate-400">You’re all caught up.</p>
            ) : (
              notifications.map((notification) => (
                <DropdownMenu.Item
                  key={notification.id}
                  onSelect={() => bell.openNotification(notification)}
                  className="flex cursor-pointer gap-3 rounded-lg px-3 py-2.5 outline-none data-highlighted:bg-slate-50"
                >
                  <span
                    className={cn(
                      'mt-1.5 size-2 shrink-0 rounded-full',
                      notification.read ? 'bg-transparent' : notification.severity === 'URGENT' ? 'bg-rose-500' : 'bg-teal-500',
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm', notification.read ? 'text-slate-500' : 'font-medium text-slate-900')}>
                      {notification.title}
                    </span>
                    <span className="block text-xs text-slate-500">{notification.body}</span>
                    <span className="block text-[11px] text-slate-400">{formatInstant(notification.createdAt)}</span>
                  </span>
                </DropdownMenu.Item>
              ))
            )}
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
          <DropdownMenu.Item asChild className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none data-highlighted:bg-slate-50">
            <Link to="/settings">
              <Settings className="size-4" aria-hidden /> Notification settings
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
