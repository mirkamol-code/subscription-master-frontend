import type { AppNotification } from '@/types/api'

type NotificationLinks = Pick<AppNotification, 'subscriptionId' | 'link'>

function isAppPath(link: string) {
  return link.startsWith('/') && !link.startsWith('//')
}

function isAbsoluteHttpUrl(link: string) {
  return /^https?:\/\//i.test(link)
}

function toAppPath(link: string, appOrigin: string): string | null {
  if (!isAppPath(link) && !isAbsoluteHttpUrl(link)) return null
  const url = new URL(link, appOrigin)
  return url.origin === appOrigin ? `${url.pathname}${url.search}${url.hash}` : null
}

export function getNotificationTarget(notification: NotificationLinks, appOrigin: string): string | null {
  if (notification.subscriptionId !== null) return `/subscriptions/${notification.subscriptionId}`
  const link = notification.link?.trim()
  return link ? toAppPath(link, appOrigin) : null
}
