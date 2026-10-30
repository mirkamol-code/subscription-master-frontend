const DEFAULT_TITLE = 'Subscription Master'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

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
    if (target.protocol !== 'https:' && target.protocol !== 'http:') return self.location.origin + '/'
    return self.location.origin + target.pathname + target.search + target.hash
  } catch {
    return self.location.origin + '/'
  }
}

function openInApp(url) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const open = windows.find((client) => new URL(client.url).origin === self.location.origin)
    if (!open) return self.clients.openWindow(url)
    return open
      .navigate(url)
      .then((client) => (client ?? open).focus())
      .catch(() => self.clients.openWindow(url))
  })
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
  event.waitUntil(openInApp(toAppUrl(event.notification.data?.url || '/')))
})
