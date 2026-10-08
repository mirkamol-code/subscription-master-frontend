import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
        <Button asChild className="mt-6" variant="accent">
          <Link to="/">Return to dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
