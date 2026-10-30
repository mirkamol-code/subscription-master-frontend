import { Loader2 } from 'lucide-react'
import { useLoginCallback } from '@/features/auth/use-login-callback'

export function AuthCallbackPage() {
  useLoginCallback()

  return (
    <main className="grid min-h-screen place-items-center bg-white" aria-busy="true">
      <p className="flex items-center gap-3 text-sm text-slate-500">
        <Loader2 className="size-5 animate-spin text-teal-600" aria-hidden />
        Signing you in…
      </p>
    </main>
  )
}
