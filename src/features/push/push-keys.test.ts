import { describe, expect, it } from 'vitest'
import { toPushSubscriptionRequest, urlBase64ToUint8Array } from '@/features/push/push-keys'

describe('urlBase64ToUint8Array', () => {
  it('decodes a URL-safe base64 VAPID key without padding', () => {
    // when
    const bytes = urlBase64ToUint8Array('AQID-_8')

    // then
    expect(Array.from(bytes)).toEqual([1, 2, 3, 251, 255])
  })

  it.each(['not base64!', ''])('rejects the broken key "%s"', (key) => {
    // when
    const decode = () => urlBase64ToUint8Array(key)

    // then
    expect(decode).toThrow('The server sent an invalid push key')
  })
})

describe('toPushSubscriptionRequest', () => {
  const browserSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
    expirationTime: null,
    keys: { p256dh: 'BNc-p256dh', auth: 'tBH-auth' },
  }

  it('sends the endpoint and both keys the backend needs', () => {
    // when
    const request = toPushSubscriptionRequest(browserSubscription)

    // then
    expect(request).toEqual({
      endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
      keys: { p256dh: 'BNc-p256dh', auth: 'tBH-auth' },
    })
  })

  it.each<[string, PushSubscriptionJSON]>([
    ['no auth key', { ...browserSubscription, keys: { p256dh: 'BNc-p256dh' } }],
    ['no keys', { endpoint: browserSubscription.endpoint }],
    ['no endpoint', { keys: browserSubscription.keys }],
    ['an http endpoint', { ...browserSubscription, endpoint: 'http://push.example/abc' }],
  ])('refuses a subscription with %s', (_, subscription) => {
    // when
    const request = toPushSubscriptionRequest(subscription)

    // then
    expect(request).toBeNull()
  })
})
