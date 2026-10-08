import type { TokenResponse } from '@/types/api'

const TOKEN_KEY = 'subscription-master.session'

export interface StoredSession extends TokenResponse {
  email: string
  expiresAt: number
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
    const session: StoredSession = {
      ...tokens,
      email: email ?? existing?.email ?? '',
      expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
    }
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
    window.dispatchEvent(new Event('auth-session-changed'))
    return session
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event('auth-session-changed'))
  },
}

