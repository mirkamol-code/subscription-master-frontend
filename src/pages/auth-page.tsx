import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { ArrowRight, CalendarClock, Eye, EyeOff, Globe2, Loader2, Lock, PieChart } from 'lucide-react'
import { getApiError } from '@/api/client'
import { BrandMark } from '@/components/common/brand-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/auth-context'
import { useAuthLockout } from '@/hooks/use-auth-lockout'
import { tokenStore } from '@/lib/token-store'
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from '@/schemas/auth'

const HIGHLIGHTS = [
  { icon: CalendarClock, title: 'Never miss a renewal', text: 'See every upcoming payment at a glance.' },
  { icon: PieChart, title: 'Know where it goes', text: 'Monthly and yearly totals by category.' },
  { icon: Globe2, title: 'Any currency', text: 'Som, dollars and euros, converted for you.' },
]

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1.5 text-[13px] text-rose-600">
      {message}
    </p>
  ) : null
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

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const isLogin = mode === 'login'
  const mutation = isLogin ? auth.login : auth.register
  const lockout = useAuthLockout()
  // Lockout only guards sign-in; registering is never blocked by failed sign-in attempts.
  const isLocked = isLogin && lockout.isLocked

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: { email: '', password: '' },
  })
  const { errors } = form.formState
  const isBusy = mutation.isPending || isLocked

  const onSubmit = form.handleSubmit(async (values) => {
    if (isLocked) return
    setServerError('')

    try {
      const tokens = await mutation.mutateAsync(values)
      lockout.recordSuccessfulAttempt()
      tokenStore.set(tokens, values.email)
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(requestedPath || '/', { replace: true })
    } catch (error) {
      if (isLogin && axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data as { errorCode?: string; retryAfterSeconds?: number } | undefined
        if (status === 429 || data?.errorCode === 'AUTH_LOCKED') {
          const retrySeconds =
            Number(data?.retryAfterSeconds || error.response?.headers?.['retry-after']) || 60
          lockout.lockWithDuration(retrySeconds)
        } else if (status === 401) {
          lockout.recordFailedAttempt()
        }
      }
      setServerError(getApiError(error))
    }
  })

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

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin ? 'Sign in to see your subscriptions.' : 'Start tracking what you pay for — it’s free.'}
          </p>

          <div className="mt-6 space-y-3 empty:hidden">
            {searchParams.get('expired') && !serverError && (
              <Banner tone="warning">Your session ended. Please sign in again.</Banner>
            )}
            {isLocked ? (
              <Banner tone="error">
                Too many attempts. You can try again in{' '}
                <span className="font-semibold tabular-nums">{lockout.formattedTime}</span>.
              </Banner>
            ) : (
              serverError && <Banner tone="error">{serverError}</Banner>
            )}
          </div>

          <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isBusy}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...form.register('email')}
              />
              <FieldError id="email-error" message={errors.email?.message} />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="pr-11"
                  disabled={isBusy}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : isLogin ? undefined : 'password-hint'}
                  {...form.register('password')}
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldError id="password-error" message={errors.password?.message} />
              {!isLogin && !errors.password && (
                <p id="password-hint" className="mt-1.5 text-[13px] text-slate-400">
                  At least 12 characters.
                </p>
              )}
              {isLogin && lockout.failedAttempts > 0 && !isLocked && (
                <p className="mt-1.5 text-[13px] text-amber-700">
                  {lockout.attemptsRemaining} {lockout.attemptsRemaining === 1 ? 'attempt' : 'attempts'} left
                  before a short pause.
                </p>
              )}
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isBusy}>
              {isLocked ? (
                <>
                  <Lock className="size-4" /> Try again in {lockout.formattedTime}
                </>
              ) : mutation.isPending ? (
                <Loader2 className="size-5 animate-spin" aria-label="Please wait" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'} <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? 'New here?' : 'Already have an account?'}{' '}
            <Link className="font-medium text-teal-700 hover:underline" to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
