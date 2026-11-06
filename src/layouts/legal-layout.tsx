import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/common/brand-mark'
import { SiteFooter } from '@/components/common/site-footer'
import { APP_NAME, LAST_UPDATED } from '@/features/legal/legal-constants'
import { ThemeToggle } from '@/features/theme/theme-toggle'

interface LegalLayoutProps {
  title: string
  children: ReactNode
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark />
            <span className="text-[15px] font-bold tracking-tight text-fg">{APP_NAME}</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 animate-fade-in sm:px-8 sm:py-14">
        <article>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-fg/90">{children}</div>
        </article>
      </main>

      <SiteFooter className="border-t border-border px-4 py-6" />
    </div>
  )
}

interface LegalSectionProps {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3 [&_a]:font-medium [&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      <h2 className="text-xl font-bold tracking-tight text-fg">{title}</h2>
      {children}
    </section>
  )
}
