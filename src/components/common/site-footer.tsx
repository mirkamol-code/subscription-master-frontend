import { Link } from 'react-router-dom'
import { APP_NAME, CONTACT_EMAIL } from '@/features/legal/legal-constants'
import { cn } from '@/lib/utils'

interface SiteFooterProps {
  className?: string
}

const linkClassName =
  'rounded outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring'

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn('text-xs text-muted', className)}>
      <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span>© {new Date().getFullYear()} {APP_NAME}</span>
        <Link to="/privacy" className={linkClassName}>
          Privacy Policy
        </Link>
        <Link to="/terms" className={linkClassName}>
          Terms of Service
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClassName}>
          Contact
        </a>
      </nav>
    </footer>
  )
}
