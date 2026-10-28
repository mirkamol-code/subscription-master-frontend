# Backend-to-frontend map

This map reflects the OpenAPI document at `https://subscriptionmaster.app/api/v3/api-docs` (base server URL `https://subscriptionmaster.app/api`).

| Backend endpoint | API function | React Query hook / action | Screen |
|---|---|---|---|
| `POST /auth/login` | `authApi.login` | Auth context mutation | Login |
| `POST /auth/register` | `authApi.register` | Auth context mutation | Registration |
| `POST /auth/refresh` | Axios response interceptor | Automatic single-flight refresh | All protected screens |
| `POST /auth/logout` | `authApi.logout` | Auth context logout action | Header user menu |
| `GET /subscriptions` | `subscriptionsApi.list` | `useSubscriptions` | Dashboard, subscription list |
| `GET /subscriptions/all` | `subscriptionsApi.listAll` | `useAllSubscriptions` | Calendar view, summary fallback, reports |
| `POST /subscriptions` | `subscriptionsApi.create` | `useCreateSubscription` | Add subscription |
| `GET /subscriptions/{id}` | `subscriptionsApi.get` | `useSubscription` | Details, edit |
| `PUT /subscriptions/{id}` | `subscriptionsApi.update` | `useUpdateSubscription` | Edit subscription |
| `DELETE /subscriptions/{id}` | `subscriptionsApi.remove` | `useDeleteSubscription` | Details, subscription list |
| `POST /subscriptions/{id}/pause` | `subscriptionsApi.pause` | `usePauseSubscription` | Details, subscription list |
| `POST /subscriptions/{id}/resume` | `subscriptionsApi.resume` | `useResumeSubscription` | Details, subscription list |
| `GET /subscriptions/{id}/history` | `subscriptionsApi.getHistory` | `useSubscriptionHistory` | Subscription details |
| `GET /statistics/summary` | `statisticsApi.summary` | `useSummary` | Dashboard |
| `GET /statistics/monthly-dynamics` | `statisticsApi.monthlyDynamics` | `useMonthlyDynamics` | Dashboard |
| `GET /admin/statistics/service-usage` | `statisticsApi.adminUsage` | `useAdminUsage` | Service usage |


