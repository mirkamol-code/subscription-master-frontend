import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { AdminRoute } from '@/routes/admin-route'
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/protected-route'
import { Skeleton } from '@/components/ui/skeleton'

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin-dashboard-page').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin-analytics-page').then((m) => ({ default: m.AdminAnalyticsPage })),
)
const AdminPaymentsPage = lazy(() =>
  import('@/pages/admin-payments-page').then((m) => ({ default: m.AdminPaymentsPage })),
)
const AdminUserPage = lazy(() =>
  import('@/pages/admin-user-page').then((m) => ({ default: m.AdminUserPage })),
)
const AdminUsagePage = lazy(() =>
  import('@/pages/admin-usage-page').then((m) => ({ default: m.AdminUsagePage })),
)
const AuthPage = lazy(() =>
  import('@/pages/auth-page').then((m) => ({ default: m.AuthPage })),
)
const AuthCallbackPage = lazy(() =>
  import('@/pages/auth-callback-page').then((m) => ({ default: m.AuthCallbackPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const LandingPage = lazy(() =>
  import('@/pages/landing-page').then((m) => ({ default: m.LandingPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found-page').then((m) => ({ default: m.NotFoundPage })),
)
const PrivacyPage = lazy(() =>
  import('@/pages/privacy-page').then((m) => ({ default: m.PrivacyPage })),
)
const ReportsPage = lazy(() =>
  import('@/pages/reports-page').then((m) => ({ default: m.ReportsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
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
const TermsPage = lazy(() =>
  import('@/pages/terms-page').then((m) => ({ default: m.TermsPage })),
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
          <Route path="/login" element={<AuthPage />} />
        </Route>
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route element={<ProtectedRoute signedOutLanding={<LandingPage />} />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="subscriptions/:id" element={<SubscriptionDetailPage />} />
            <Route path="subscriptions/:id/edit" element={<SubscriptionFormPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="admin/users/:id" element={<AdminUserPage />} />
              <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="admin/payments" element={<AdminPaymentsPage />} />
              <Route path="admin/usage" element={<AdminUsagePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
