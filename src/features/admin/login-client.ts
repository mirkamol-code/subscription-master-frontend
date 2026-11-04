import { Globe, Laptop, Smartphone, Tablet, type LucideIcon } from 'lucide-react'
import type { LoginEvent } from '@/features/admin/types'

export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown'

export interface ClientInfo {
  device: DeviceType
  browser: string
  os: string
  summary: string
}

function detectFallbackOperatingSystem(ua: string): string {
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('Mac OS X') || ua.includes('Macintosh')) return 'macOS'
  if (ua.includes('CrOS')) return 'ChromeOS'
  if (ua.includes('Linux') || ua.includes('X11')) return 'Linux'
  return 'Unknown'
}

function detectFallbackDevice(ua: string, os: string): DeviceType {
  if (ua.includes('iPad') || ua.includes('Tablet') || (os === 'Android' && !ua.includes('Mobile'))) {
    return 'Tablet'
  }
  if (
    ua.includes('Mobile') ||
    ua.includes('iPhone') ||
    ua.includes('iPod') ||
    os === 'Android' ||
    ua.includes('Windows Phone')
  ) {
    return 'Mobile'
  }
  return 'Desktop'
}

function detectFallbackBrowser(ua: string): string {
  if (ua.includes('Edg/') || ua.includes('Edge/')) return 'Edge'
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera'
  if (ua.includes('SamsungBrowser/')) return 'Samsung Internet'
  if (ua.includes('UCBrowser/')) return 'UC Browser'
  if (ua.includes('Firefox/') || ua.includes('FxiOS/')) return 'Firefox'
  if (ua.includes('Chrome/') || ua.includes('CriOS/')) return 'Chrome'
  if (ua.includes('Safari/') || ua.includes('AppleWebKit/')) return 'Safari'
  return 'Unknown'
}

function buildSummary(browser: string, os: string): string {
  const hasBrowser = browser !== 'Unknown' && browser.length > 0
  const hasOs = os !== 'Unknown' && os.length > 0

  if (hasBrowser && hasOs) {
    return `${browser} on ${os}`
  }
  if (hasBrowser) {
    return browser
  }
  if (hasOs) {
    return os
  }
  return 'Unknown client'
}

export function resolveLoginClient(
  login: Pick<LoginEvent, 'userAgent' | 'device' | 'browser' | 'os'>
): ClientInfo {
  const ua = login.userAgent?.trim() ?? ''

  let device: DeviceType = (login.device as DeviceType) || 'Unknown'
  let browser = login.browser?.trim() || 'Unknown'
  let os = login.os?.trim() || 'Unknown'

  if (device === 'Unknown' || browser === 'Unknown' || os === 'Unknown') {
    if (ua.length > 0) {
      if (os === 'Unknown') os = detectFallbackOperatingSystem(ua)
      if (device === 'Unknown') device = detectFallbackDevice(ua, os)
      if (browser === 'Unknown') browser = detectFallbackBrowser(ua)
    }
  }

  const summary = buildSummary(browser, os)
  return { device, browser, os, summary }
}

export function getDeviceIcon(device: DeviceType): LucideIcon {
  switch (device) {
    case 'Mobile':
      return Smartphone
    case 'Tablet':
      return Tablet
    case 'Desktop':
      return Laptop
    default:
      return Globe
  }
}
