import { Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsAdmin } from '@/hooks/use-current-user'
import { NotFoundPage } from '@/pages/not-found-page'

export function AdminRoute() {
  const { isAdmin, isLoading } = useIsAdmin()
  if (isLoading) return <Skeleton className="h-48 rounded-3xl" />
  return isAdmin ? <Outlet /> : <NotFoundPage embedded />
}
