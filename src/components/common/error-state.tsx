import { CloudOff, RotateCw } from 'lucide-react'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ErrorState({
  error,
  onRetry,
  title = 'We couldn’t load this',
  bare = false,
}: {
  error: unknown
  onRetry?: () => void
  title?: string
  /** Render without its own card, for use inside an existing card. */
  bare?: boolean
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-56 flex-col items-center justify-center p-8 text-center animate-fade-in',
        !bare && 'rounded-2xl border border-border bg-surface',
      )}
    >
      <div className="grid size-12 place-items-center rounded-2xl border border-border bg-surface-raised text-muted">
        <CloudOff className="size-5" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{getApiError(error)}</p>
      {onRetry && (
        <Button className="mt-5" variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="size-3.5" /> Try again
        </Button>
      )}
    </div>
  )
}
