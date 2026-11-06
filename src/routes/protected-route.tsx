import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import { isLandingPath } from './landing-path'

interface ProtectedRouteProps {
  signedOutLanding?: ReactNode
}

export function ProtectedRoute({ signedOutLanding }: ProtectedRouteProps) {
  const { session } = useAuth()
  const location = useLocation()
  if (session) return <Outlet />
  if (signedOutLanding && isLandingPath(location.pathname)) return signedOutLanding
  return <Navigate to="/login" replace state={{ from: location }} />
}

export function PublicOnlyRoute() {
  const { session } = useAuth()
  return session ? <Navigate to="/" replace /> : <Outlet />
}
