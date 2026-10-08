import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'

export function ProtectedRoute() {
  const { session } = useAuth()
  const location = useLocation()
  return session ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function PublicOnlyRoute() {
  const { session } = useAuth()
  return session ? <Navigate to="/" replace /> : <Outlet />
}

