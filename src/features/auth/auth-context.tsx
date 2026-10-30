import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth'
import { forgetBrowserPush } from '@/features/push/browser-push'
import { tokenStore, type StoredSession } from '@/lib/token-store'

interface AuthContextValue {
  session: StoredSession | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(tokenStore.get())
  const queryClient = useQueryClient()

  useEffect(() => {
    const sync = () => setSession(tokenStore.get())
    window.addEventListener('auth-session-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('auth-session-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      logout: () => {
        const current = tokenStore.get()
        void forgetBrowserPush().catch(() => {
          // Best effort: the backend drops the expired endpoint on its next send
        })
        if (current?.refreshToken) {
          void authApi.logout(current.refreshToken).catch(() => {
            // Ignore network error on logout; local session is cleared immediately
          })
        }
        tokenStore.clear()
        queryClient.clear()
      },
    }),
    [queryClient, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook intentionally share one context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
