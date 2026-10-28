import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/protected-route'
import { Skeleton } from '@/components/ui/skeleton'

const AdminUsagePage = lazy(() =>
  import('@/pages/admin-usage-page').then((m) => ({ default: m.AdminUsagePage })),
)
const AuthPage = lazy(() =>
  import('@/pages/auth-page').then((m) => ({ default: m.AuthPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found-page').then((m) => ({ default: m.NotFoundPage })),
)
const ReportsPage = lazy(() =>
  import('@/pages/reports-page').then((m) => ({ default: m.ReportsPage })),
)
const SubscriptionDetailPage = lazy(() =>
  import('@/pages/subscription-detail-page').then((m) => ({ default: m.SubscriptionDetailPage })),
)
const SubscriptionFormPage = lazy(() =>
  import('@/pages/subscription-form-page').then((m) => ({ default: m.SubscriptionFormPage })),
)
const SubscriptionsPage = lazy(() =>
  import('@/pages/subscriptions-page').then((m) => ({ default: m.SubscriptionsPage })),
)

function PageFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<AuthPage key="login" mode="login" />} />
          <Route path="/register" element={<AuthPage key="register" mode="register" />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="subscriptions/new" element={<SubscriptionFormPage mode="create" />} />
            <Route path="subscriptions/:id" element={<SubscriptionDetailPage />} />
            <Route path="subscriptions/:id/edit" element={<SubscriptionFormPage mode="edit" />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="admin/usage" element={<AdminUsagePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
