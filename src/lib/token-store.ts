import type { TokenResponse } from '@/types/api'

const TOKEN_KEY = 'subscription-master.session'

export interface StoredSession extends TokenResponse {
  email: string
  expiresAt: number
}

interface JwtPayload {
  sub?: string
  roles?: string[]
  permissions?: string[]
}

function parseJwtPayload(token?: string): JwtPayload | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded)) as JwtPayload
  } catch {
    return null
  }
}

export const tokenStore = {
  get(): StoredSession | null {
    try {
      const value = localStorage.getItem(TOKEN_KEY)
      return value ? (JSON.parse(value) as StoredSession) : null
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
  },
  set(tokens: TokenResponse, email?: string) {
    const existing = this.get()
    const jwt = parseJwtPayload(tokens.accessToken)
    const session: StoredSession = {
      ...tokens,
      email: email ?? existing?.email ?? jwt?.sub ?? '',
      expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
    }
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
    window.dispatchEvent(new Event('auth-session-changed'))
    return session
  },
  hasAdminRole(): boolean | null {
    const session = this.get()
    const payload = parseJwtPayload(session?.accessToken)
    if (!payload || !Array.isArray(payload.roles)) return null
    return payload.roles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN')
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event('auth-session-changed'))
  },
}

