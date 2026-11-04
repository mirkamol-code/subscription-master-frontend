import { describe, expect, it } from 'vitest'
import { getDeviceIcon, resolveLoginClient } from '@/features/admin/login-client'
import { Globe, Laptop, Smartphone, Tablet } from 'lucide-react'

describe('resolveLoginClient', () => {
  it('prefers backend provided fields when available', () => {
    const client = resolveLoginClient({
      device: 'Desktop',
      browser: 'Chrome',
      os: 'macOS',
      userAgent: 'raw-ua',
    })

    expect(client).toEqual({
      device: 'Desktop',
      browser: 'Chrome',
      os: 'macOS',
      summary: 'Chrome on macOS',
    })
  })

  it('falls back to parsing userAgent when backend fields are missing', () => {
    const client = resolveLoginClient({
      device: null,
      browser: null,
      os: null,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    })

    expect(client).toEqual({
      device: 'Mobile',
      browser: 'Safari',
      os: 'iOS',
      summary: 'Safari on iOS',
    })
  })

  it('falls back to parsing userAgent for Android tablets', () => {
    const client = resolveLoginClient({
      device: undefined,
      browser: undefined,
      os: undefined,
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Safari/537.36',
    })

    expect(client).toEqual({
      device: 'Tablet',
      browser: 'Chrome',
      os: 'Android',
      summary: 'Chrome on Android',
    })
  })

  it('handles null and blank userAgent gracefully', () => {
    const client = resolveLoginClient({
      device: null,
      browser: null,
      os: null,
      userAgent: null,
    })

    expect(client).toEqual({
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      summary: 'Unknown client',
    })
  })

  it('formats summary with browser only if os is unknown', () => {
    const client = resolveLoginClient({
      device: 'Desktop',
      browser: 'Firefox',
      os: 'Unknown',
      userAgent: null,
    })

    expect(client.summary).toBe('Firefox')
  })
})

describe('getDeviceIcon', () => {
  it('maps device types to correct Lucide icons', () => {
    expect(getDeviceIcon('Desktop')).toBe(Laptop)
    expect(getDeviceIcon('Mobile')).toBe(Smartphone)
    expect(getDeviceIcon('Tablet')).toBe(Tablet)
    expect(getDeviceIcon('Unknown')).toBe(Globe)
  })
})
