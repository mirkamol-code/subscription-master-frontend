const DEFAULT_TITLE = 'Subscription Master'

function readPayload(event) {
  if (!event.data) return {}
  try {
    return event.data.json()
  } catch {
    return { body: event.data.text() }
  }
}

function toAppUrl(url) {
  try {
    const target = new URL(url, self.location.origin)
    return target.origin === self.location.origin ? target.href : self.location.origin + '/'
  } catch {
    return self.location.origin + '/'
  }
}

self.addEventListener('push', (event) => {
  const payload = readPayload(event)
  event.waitUntil(
    self.registration.showNotification(payload.title || DEFAULT_TITLE, {
      body: payload.body || '',
      icon: '/favicon.svg',
      data: { url: toAppUrl(payload.url || '/') },
      requireInteraction: payload.severity === 'URGENT',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = toAppUrl(event.notification.data?.url || '/')
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => new URL(client.url).origin === self.location.origin)
      if (open) return open.navigate(url).then((client) => (client ?? open).focus())
      return self.clients.openWindow(url)
    }),
  )
})
