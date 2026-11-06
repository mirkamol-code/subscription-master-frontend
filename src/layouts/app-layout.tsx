import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CalendarClock,
  ChevronsUpDown,
  CreditCard,
  FileDown,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { BrandMark } from '@/components/common/brand-mark'
import { SiteFooter } from '@/components/common/site-footer'
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-context'
import { CurrencySwitcherDropdown } from '@/features/currency/currency-switcher-dropdown'
import { NotificationBell } from '@/features/notifications/notification-bell'
import { ThemeToggle } from '@/features/theme/theme-toggle'
import { useCurrentUser, useIsAdmin } from '@/hooks/use-current-user'
import type { UserProfile } from '@/types/api'
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
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Admin', href: '/admin', icon: ShieldCheck, adminOnly: true },
  { label: 'Merchant analytics', href: '/admin/analytics', icon: TrendingUp, adminOnly: true },
  { label: 'Payment calendar', href: '/admin/payments', icon: CalendarClock, adminOnly: true },
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
            end={href === '/' || href === '/admin'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-surface-raised text-fg before:absolute before:inset-y-2 before:-left-4 before:w-0.5 before:rounded-full before:bg-accent [&_svg]:text-accent'
                  : 'text-muted hover:bg-fg/[0.04] hover:text-fg',
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

type SignedInUser = Pick<UserProfile, 'email' | 'displayName' | 'avatarUrl'>

function getUserName(user: SignedInUser) {
  return user.displayName || user.email
}

function UserAvatar({ user }: { user: SignedInUser }) {
  return user.avatarUrl ? (
    <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-(image:--gradient-brand) text-sm font-semibold text-white">
      {getUserName(user).charAt(0).toUpperCase() || 'U'}
    </span>
  )
}

function AccountMenu({ user, onLogout }: { user: SignedInUser; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left outline-none transition-colors hover:bg-fg/[0.04] focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-fg/[0.06]"
          aria-label="Account menu"
        >
          <UserAvatar user={user} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-fg">
              {getUserName(user)}
            </span>
            <span className="block truncate text-xs text-muted">
              {user.displayName ? user.email : 'Personal account'}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-52">
        <DropdownMenuItem isDestructive onSelect={onLogout}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Sidebar({
  isAdmin,
  user,
  onLogout,
  onNavigate,
}: {
  isAdmin: boolean
  user: SignedInUser
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 outline-none">
        <BrandMark />
        <span className="text-[15px] font-bold tracking-tight text-fg">Subscription Master</span>
      </Link>
      <SidebarNav isAdmin={isAdmin} onNavigate={onNavigate} />
      <div className="mt-auto border-t border-border pt-3">
        <AccountMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, logout } = useAuth()
  const { isAdmin } = useIsAdmin()
  const { data: profile } = useCurrentUser()
  const navigate = useNavigate()
  const user: SignedInUser = {
    email: profile?.email || session?.email || 'Account',
    displayName: profile?.displayName ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-background lg:block">
        <Sidebar isAdmin={isAdmin} user={user} onLogout={handleLogout} />
      </aside>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          placement="left"
          className="bg-background lg:hidden"
          overlayClassName="lg:hidden"
        >
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <DialogDescription className="sr-only">Move between sections</DialogDescription>
          <DialogCloseButton className="absolute right-3 top-5" aria-label="Close menu" />
          <Sidebar
            isAdmin={isAdmin}
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-xl text-muted outline-none hover:bg-fg/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <BrandMark className="size-7" />
              <span className="text-sm font-bold tracking-tight text-fg">Subscription Master</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <CurrencySwitcherDropdown />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
          <Outlet />
        </main>

        <SiteFooter className="border-t border-border px-4 py-6" />
      </div>
    </div>
  )
}
