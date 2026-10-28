import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** `embedded` renders inside the app shell instead of taking over the whole screen. */
export function NotFoundPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <main
      className={cn(
        'grid place-items-center p-6 text-center animate-fade-in',
        embedded ? 'min-h-[60vh]' : 'min-h-screen',
      )}
    >
      <div>
        <p className="bg-linear-to-br from-teal-500 to-emerald-600 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">This page doesn’t exist or may have moved.</p>
        <Button asChild className="mt-8" variant="default">
          <Link to="/">Go to overview</Link>
        </Button>
      </div>
    </main>
  )
}
