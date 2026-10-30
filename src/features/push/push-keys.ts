import type { PushSubscriptionRequest } from '@/types/api'

const INVALID_KEY = 'The server sent an invalid push key'

export function urlBase64ToUint8Array(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.trim().replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  try {
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
    if (!bytes.length) throw new Error(INVALID_KEY)
    return bytes
  } catch {
    throw new Error(INVALID_KEY)
  }
}

export function toPushSubscriptionRequest(subscription: PushSubscriptionJSON): PushSubscriptionRequest | null {
  const endpoint = subscription.endpoint ?? ''
  const p256dh = subscription.keys?.p256dh ?? ''
  const auth = subscription.keys?.auth ?? ''
  if (!endpoint.startsWith('https://') || !p256dh || !auth) return null
  return { endpoint, keys: { p256dh, auth } }
}
