import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, ChevronDown, CreditCard, FileDown, LayoutDashboard, LogOut, Menu, Plus, ShieldCheck, X } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Reports', href: '/reports', icon: FileDown },
  { label: 'Service usage', href: '/admin/usage', icon: BarChart3 },
]

const titles: Record<string, string> = {
  '/': 'Overview',
  '/subscriptions': 'Subscriptions',
  '/subscriptions/new': 'Add subscription',
  '/reports': 'Annual reports',
  '/admin/usage': 'Service usage',
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
      <div className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"><ShieldCheck className="size-5" strokeWidth={2.5} /></div>
      <div><div className="text-sm font-bold tracking-tight text-white">Subscription Master</div><div className="text-xs text-slate-400">Spend with clarity</div></div>
    </Link>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-slate-950 p-4 text-slate-300">
      <div className="px-2 py-3"><Brand /></div>
      <nav className="mt-8 space-y-1" aria-label="Main navigation">
        {navigation.map(({ href, icon: Icon, label }) => (
          <NavLink key={href} to={href} end={href === '/'} onClick={onNavigate} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white')}>
            <Icon className="size-4.5" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-400">Renewal dates and spending are calculated by the Subscription Master API.</div>
    </div>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const title = location.pathname.match(/^\/subscriptions\/\d+/)
    ? location.pathname.endsWith('/edit') ? 'Edit subscription' : 'Subscription details'
    : titles[location.pathname] ?? 'Subscription Master'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block"><Sidebar /></aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/45" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 shadow-2xl">
            <button className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-400 hover:bg-white/10" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></button>
            <h1 className="text-lg font-bold tracking-tight text-slate-950">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="accent" className="hidden sm:inline-flex"><Link to="/subscriptions/new"><Plus className="size-4" /> Add subscription</Link></Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex max-w-52 items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-700 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">{session?.email?.slice(0, 1).toUpperCase() || 'U'}</span>
                  <span className="hidden truncate md:block">{session?.email || 'Account'}</span><ChevronDown className="size-4 text-slate-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="z-50 min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">Signed in as<br /><span className="font-medium text-slate-800">{session?.email}</span></div>
                  <DropdownMenu.Item onSelect={handleLogout} className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50"><LogOut className="size-4" /> Sign out</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

