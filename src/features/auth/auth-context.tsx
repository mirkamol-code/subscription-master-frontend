import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth'
import { tokenStore, type StoredSession } from '@/lib/token-store'

interface AuthContextValue {
  session: StoredSession | null
  login: ReturnType<typeof useLoginMutation>
  register: ReturnType<typeof useRegisterMutation>
  logout: () => void
}

function useLoginMutation() {
  return useMutation({ mutationFn: authApi.login })
}

function useRegisterMutation() {
  return useMutation({ mutationFn: authApi.register })
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(tokenStore.get())
  const queryClient = useQueryClient()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

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
      login: loginMutation,
      register: registerMutation,
      logout: () => {
        tokenStore.clear()
        queryClient.clear()
      },
    }),
    [loginMutation, queryClient, registerMutation, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook intentionally share one context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
