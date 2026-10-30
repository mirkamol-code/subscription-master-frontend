import { pushApi } from '@/api/endpoints/push'
import { toPushSubscriptionRequest, urlBase64ToUint8Array } from '@/features/push/push-keys'

const SERVICE_WORKER_URL = '/sw.js'

export type BrowserPushState = 'unsupported' | 'blocked' | 'off' | 'on'

export function isBrowserPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

async function findPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL)
  return (await registration?.pushManager.getSubscription()) ?? null
}

async function askNotificationPermission() {
  const permission = await Notification.requestPermission()
  if (permission === 'denied') {
    throw new Error('Notifications are blocked for this site. Allow them in your browser’s site settings.')
  }
  if (permission !== 'granted') throw new Error('Allow notifications when your browser asks, to get reminders here.')
}

export async function readBrowserPushState(): Promise<BrowserPushState> {
  if (!isBrowserPushSupported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'blocked'
  return (await findPushSubscription()) ? 'on' : 'off'
}

export async function turnOnBrowserPush() {
  await askNotificationPermission()
  const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL)
  await navigator.serviceWorker.ready
  const publicKey = await pushApi.getVapidPublicKey()
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }))
  const request = toPushSubscriptionRequest(subscription.toJSON())
  if (!request) {
    await subscription.unsubscribe()
    throw new Error('This browser can’t receive notifications.')
  }
  await pushApi.subscribe(request)
}

export async function turnOffBrowserPush() {
  const subscription = await findPushSubscription()
  if (!subscription) return
  await pushApi.unsubscribe(subscription.endpoint)
  await subscription.unsubscribe()
}

export async function forgetBrowserPush(accessToken: string | undefined) {
  if (!isBrowserPushSupported()) return
  try {
    const subscription = await findPushSubscription()
    if (!subscription) return
    if (accessToken) await pushApi.unsubscribe(subscription.endpoint, accessToken).catch(() => undefined)
    await subscription.unsubscribe()
  } catch {
    return
  }
}
