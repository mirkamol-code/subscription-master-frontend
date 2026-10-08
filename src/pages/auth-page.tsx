import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/auth-context'
import { tokenStore } from '@/lib/token-store'
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from '@/schemas/auth'

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null
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
  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError('')
    try {
      const tokens = await mutation.mutateAsync(values)
      tokenStore.set(tokens, values.email)
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(requestedPath || '/', { replace: true })
    } catch (error) {
      setServerError(getApiError(error))
    }
  })

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-16 size-96 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950"><ShieldCheck className="size-5" /></div><span className="font-bold tracking-tight">Subscription Master</span></div>
        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-teal-300">Your recurring spend, organized</p>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">Know what renews. Control what you spend.</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Keep every subscription, payment date, and spending trend in one calm workspace.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {['Renewal visibility', 'Spending insights', 'Annual exports'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{item}</div>)}
          </div>
        </div>
        <p className="relative text-xs text-slate-500">Protected by secure token-based authentication.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="grid size-10 place-items-center rounded-xl bg-slate-950 text-teal-300"><ShieldCheck className="size-5" /></div><span className="font-bold">Subscription Master</span></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-700"><LockKeyhole className="size-5" /></div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-sm text-slate-500">{isLogin ? 'Sign in to manage your subscriptions.' : 'Start tracking your recurring expenses.'}</p>
            {searchParams.get('expired') && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Your session expired. Please sign in again.</div>}
            {serverError && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}
            <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!form.formState.errors.email} {...form.register('email')} /><FieldError message={form.formState.errors.email?.message} /></div>
              <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} className="pr-11" aria-invalid={!!form.formState.errors.password} {...form.register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div><FieldError message={form.formState.errors.password?.message} />{!isLogin && !form.formState.errors.password && <p className="mt-1.5 text-xs text-slate-400">12–72 characters</p>}</div>
              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'} {!mutation.isPending && <ArrowRight className="size-4" />}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">{isLogin ? 'New to Subscription Master?' : 'Already have an account?'}{' '}<Link className="font-semibold text-teal-700 hover:text-teal-800" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

