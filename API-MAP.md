# Backend-to-frontend map

This map reflects the OpenAPI document at `https://subscriptionmaster.app/api/v3/api-docs` (base server URL `https://subscriptionmaster.app/api`).

| Backend endpoint | API function | React Query hook / action | Screen |
|---|---|---|---|
| `GET /oauth2/authorization/google` | `GOOGLE_LOGIN_URL` | Full-page link | Login |
| `POST /auth/exchange` | `authApi.exchange` | `exchangeLoginCodeOnce` | Google callback (`/auth/callback`) |
| `GET /auth/me` | `authApi.me` | `useCurrentUser` | Header account menu, admin access |
| `POST /auth/refresh` | Axios response interceptor | Automatic single-flight refresh | All protected screens |
| `POST /auth/logout` | `authApi.logout` | Auth context logout action | Header user menu |
| `GET /subscriptions` | `subscriptionsApi.list` | `useSubscriptions` | Dashboard, subscription list |
| `GET /subscriptions/all` | `subscriptionsApi.listAll` | `useAllSubscriptions` | Calendar view, summary fallback, reports |
| `POST /subscriptions` | `subscriptionsApi.create` | `useCreateSubscription` | Add subscription |
| `GET /subscriptions/{id}` | `subscriptionsApi.get` | `useSubscription` | Details, edit |
| `PUT /subscriptions/{id}` | `subscriptionsApi.update` | `useUpdateSubscription` | Edit subscription |
| `DELETE /subscriptions/{id}` | `subscriptionsApi.remove` | `useDeleteSubscription` | Details, subscription list |
| `PUT /subscriptions/{id}/status` | `subscriptionsApi.changeStatus` | `useChangeSubscriptionStatus` | Details, subscription list |
| `GET /subscriptions/{id}/status-history` | `subscriptionsApi.getStatusHistory` | `useStatusHistory` | Subscription details |
| `GET /subscriptions/{id}/history` | `subscriptionsApi.getHistory` | `useSubscriptionHistory` | Subscription details |
| `GET /statistics/summary` | `statisticsApi.summary` | `useSummary` | Dashboard |
| `GET /statistics/monthly-dynamics` | `statisticsApi.monthlyDynamics` | `useMonthlyDynamics` | Dashboard |
| `GET /admin/statistics/service-usage` | `statisticsApi.adminUsage` | `useAdminUsage` | Service usage |


