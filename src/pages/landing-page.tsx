import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, Inbox, ShieldCheck, UserRound } from 'lucide-react'
import { BrandMark } from '@/components/common/brand-mark'
import { HeroBackdrop } from '@/components/common/hero-backdrop'
import { SiteFooter } from '@/components/common/site-footer'
import { Button } from '@/components/ui/button'
import { HIGHLIGHTS } from '@/features/landing/highlights'
import { APP_NAME, GOOGLE_PERMISSIONS_URL } from '@/features/legal/legal-constants'
import { ThemeToggle } from '@/features/theme/theme-toggle'

const GOOGLE_ACCESS = [
  {
    icon: UserRound,
    scope: 'Basic profile (openid, email, profile)',
    why: 'Your name, email address and profile picture, to create your account and sign you in.',
  },
  {
    icon: Inbox,
    scope: 'Read your Gmail (gmail.readonly)',
    why: 'To find billing emails such as receipts, invoices and renewal notices, from up to 13 months back, and work out your subscriptions, prices and billing dates.',
  },
  {
    icon: BellRing,
    scope: 'Send email as you (gmail.send)',
    why: 'To send payment reminders from your Gmail address to that same address. We never email anyone else.',
  },
]

function GetStartedButton({ children }: { children: ReactNode }) {
  return (
    <Button asChild variant="gradient" size="lg">
      <Link to="/login">
        {children}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  )
}

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark />
            <span className="text-[15px] font-bold tracking-tight text-fg">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="dark relative overflow-hidden bg-hero text-white">
          <HeroBackdrop />
          <div className="relative mx-auto max-w-6xl px-4 py-20 animate-slide-up sm:px-8 sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-300">{APP_NAME}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              All your subscriptions.
              <span className="text-gradient-brand block">One calm place.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {APP_NAME} finds the paid subscriptions in your billing emails, shows what you spend each month and
              year, and reminds you before every renewal or free trial ends, so you are never charged by surprise.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <GetStartedButton>Get started with Google</GetStartedButton>
              <a href="#google-data" className="text-sm font-medium text-muted underline-offset-4 hover:text-white hover:underline">
                What we access and why
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
          <h2 id="features-title" className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            What you get
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-border bg-surface p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/10">
                  <Icon className="size-[18px] text-accent" />
                </span>
                <h3 className="mt-4 font-semibold text-fg">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="google-data"
          aria-labelledby="google-data-title"
          className="scroll-mt-20 border-y border-border bg-surface"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
            <h2 id="google-data-title" className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              Sign in with Google: what we access and why
            </h2>
            <p className="mt-3 max-w-3xl text-muted">
              You sign in with your Google account. Google then asks you to allow these permissions, and we use them
              only for the features above.
            </p>
            <ul className="mt-8 grid gap-4 lg:grid-cols-3">
              {GOOGLE_ACCESS.map(({ icon: Icon, scope, why }) => (
                <li key={scope} className="rounded-2xl border border-border bg-background p-5">
                  <Icon className="size-5 text-accent" />
                  <h3 className="mt-3 font-semibold text-fg">{scope}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{why}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3 rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
              <p>
                We store only the details pulled from billing emails, not email bodies or attachments. We never sell
                your data, use it for ads or use it to train AI. Our use of Google data follows the Google API Services
                User Data Policy, including the Limited Use requirements. You can delete your data in Settings or remove
                access at any time at{' '}
                <a href={GOOGLE_PERMISSIONS_URL} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                  myaccount.google.com/permissions
                </a>
                . Read the full{' '}
                <Link to="/privacy" className="font-medium text-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Stop paying for what you forgot</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Connect Gmail once and see every subscription in a few minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <GetStartedButton>Get started</GetStartedButton>
          </div>
        </section>
      </main>

      <SiteFooter className="border-t border-border px-4 py-8" />
    </div>
  )
}
