import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarClock, Globe2, Mail, PieChart } from 'lucide-react'
import { GOOGLE_LOGIN_URL } from '@/api/endpoints/auth'
import { BrandMark } from '@/components/common/brand-mark'
import { Button } from '@/components/ui/button'
import { hasLoginFailed } from '@/features/auth/login-callback'

const HIGHLIGHTS = [
  { icon: Mail, title: 'Found in your inbox', text: 'Subscriptions are read from your billing emails.' },
  { icon: CalendarClock, title: 'Never miss a renewal', text: 'See every upcoming payment at a glance.' },
  { icon: PieChart, title: 'Know where it goes', text: 'Monthly and yearly totals by category.' },
  { icon: Globe2, title: 'Any currency', text: 'Som, dollars and euros, converted for you.' },
]

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  )
}

function Banner({ tone, children }: { tone: 'error' | 'warning'; children: ReactNode }) {
  return (
    <div
      role="alert"
      className={
        tone === 'error'
          ? 'rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in'
          : 'rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 animate-fade-in'
      }
    >
      {children}
    </div>
  )
}

export function AuthPage() {
  const [searchParams] = useSearchParams()
  const isLoginFailed = hasLoginFailed(searchParams)
  const hasSessionExpired = !!searchParams.get('expired')

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full bg-teal-500/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <BrandMark />
          <span className="font-bold tracking-tight">Subscription Master</span>
        </div>

        <div className="relative my-auto max-w-md">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
            All your subscriptions.
            <span className="block bg-linear-to-r from-teal-300 to-emerald-200 bg-clip-text text-transparent">
              One calm place.
            </span>
          </h1>
          <ul className="mt-12 space-y-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Icon className="size-[18px] text-teal-300" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-slate-400">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <BrandMark />
            <span className="font-bold tracking-tight text-slate-900">Subscription Master</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in with Google to see your subscriptions.</p>

          <div className="mt-6 space-y-3 empty:hidden">
            {isLoginFailed && <Banner tone="error">Google sign-in didn’t finish. Please try again.</Banner>}
            {hasSessionExpired && !isLoginFailed && (
              <Banner tone="warning">Your session ended. Please sign in again.</Banner>
            )}
          </div>

          <Button asChild variant="outline" size="lg" className="mt-6 w-full">
            <a href={GOOGLE_LOGIN_URL}>
              <GoogleLogo />
              Continue with Google
            </a>
          </Button>

          <p className="mt-6 text-center text-[13px] leading-relaxed text-slate-400">
            Google will ask to let Subscription Master read your billing emails and send payment reminders from
            your Gmail.
          </p>
        </div>
      </section>
    </main>
  )
}
