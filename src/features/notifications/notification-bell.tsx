import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    <DropdownMenu open={bell.isOpen} onOpenChange={bell.setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={bell.unreadCount ? `Notifications, ${bell.unreadCount} unread` : 'Notifications'}
          className="relative grid size-9 place-items-center rounded-xl text-muted outline-none transition-colors hover:bg-fg/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-fg/[0.06] data-[state=open]:text-fg"
        >
          <Bell className="size-5" />
          {bell.badge && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {bell.badge}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))]">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold text-fg">Notifications</span>
          {bell.unreadCount > 0 && (
            <button
              type="button"
              onClick={bell.readAll}
              disabled={bell.isReadingAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline disabled:opacity-50"
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
            <p className="px-3 py-6 text-center text-sm text-muted">You’re all caught up.</p>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => bell.openNotification(notification)}
                className="items-start gap-3 px-3 py-2.5"
              >
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    notification.read ? 'bg-transparent' : notification.severity === 'URGENT' ? 'bg-danger' : 'bg-accent',
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-sm', notification.read ? 'text-muted' : 'font-medium text-fg')}>
                    {notification.title}
                  </span>
                  <span className="block text-xs text-muted">{notification.body}</span>
                  <span className="block text-[11px] text-muted">{formatInstant(notification.createdAt)}</span>
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="px-3 text-muted">
          <Link to="/settings">
            <Settings aria-hidden /> Notification settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
