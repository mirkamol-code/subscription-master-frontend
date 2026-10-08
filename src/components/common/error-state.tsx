import { AlertCircle, RefreshCw } from 'lucide-react'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mb-4 grid size-11 place-items-center rounded-xl bg-red-50 text-red-600">
        <AlertCircle className="size-5" />
      </div>
      <h2 className="font-semibold text-slate-950">We couldn’t load this</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{getApiError(error)}</p>
      {onRetry && (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      )}
    </div>
  )
}

