import { Loader2 } from 'lucide-react'
import { useLoginCallback } from '@/features/auth/use-login-callback'

export function AuthCallbackPage() {
  useLoginCallback()

  return (
    <main className="grid min-h-screen place-items-center bg-surface" aria-busy="true">
      <p className="flex items-center gap-3 text-sm text-muted">
        <Loader2 className="size-5 animate-spin text-accent" aria-hidden />
        Signing you in…
      </p>
    </main>
  )
}
