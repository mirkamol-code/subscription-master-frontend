import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  ChevronsUpDown,
  CreditCard,
  FileDown,
  LayoutGrid,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { BrandMark } from '@/components/common/brand-mark'
import { useAuth } from '@/features/auth/auth-context'
import { CurrencySwitcherDropdown } from '@/features/currency/currency-switcher-dropdown'
import { useIsAdmin } from '@/hooks/use-statistics'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

const navigation: NavItem[] = [
  { label: 'Overview', href: '/', icon: LayoutGrid },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Reports', href: '/reports', icon: FileDown },
  { label: 'Popular services', href: '/admin/usage', icon: BarChart3, adminOnly: true },
]

function SidebarNav({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5" aria-label="Main">
      {navigation
        .filter((item) => !item.adminOnly || isAdmin)
        .map(({ href, icon: Icon, label }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <Icon className="size-[18px]" />
            {label}
          </NavLink>
        ))}
    </nav>
  )
}

function AccountMenu({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500/60"
          aria-label="Account menu"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-teal-400 to-emerald-600 text-sm font-semibold text-white">
            {email.charAt(0).toUpperCase() || 'U'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-900">{email}</span>
            <span className="block text-xs text-slate-400">Personal account</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-slate-400" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={8}
          className="z-50 w-(--radix-dropdown-menu-trigger-width) min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-pop-in"
        >
          <DropdownMenu.Item
            onSelect={onLogout}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 outline-none data-highlighted:bg-rose-50"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Sidebar({
  isAdmin,
  email,
  onLogout,
  onNavigate,
}: {
  isAdmin: boolean
  email: string
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 outline-none">
        <BrandMark />
        <span className="text-[15px] font-bold tracking-tight text-slate-900">Subscription Master</span>
      </Link>
      <SidebarNav isAdmin={isAdmin} onNavigate={onNavigate} />
      <div className="mt-auto border-t border-slate-200/70 pt-3">
        <AccountMenu email={email} onLogout={onLogout} />
      </div>
    </div>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const { isAdmin } = useIsAdmin()
  const navigate = useNavigate()
  const email = session?.email || 'Account'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/70 bg-white lg:block">
        <Sidebar isAdmin={isAdmin} email={email} onLogout={handleLogout} />
      </aside>

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[2px] animate-fade-in lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl outline-none animate-slide-in-left lg:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Move between sections</Dialog.Description>
            <Dialog.Close
              className="absolute right-3 top-5 grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Dialog.Close>
            <Sidebar
              isAdmin={isAdmin}
              email={email}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/60 bg-canvas/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <BrandMark className="size-7" />
              <span className="text-sm font-bold tracking-tight">Subscription Master</span>
            </Link>
          </div>
          <div className="ml-auto">
            <CurrencySwitcherDropdown />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
