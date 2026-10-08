# Backend-to-frontend map

This map reflects the OpenAPI document at `https://subscriptionmaster.app/v3/api-docs` inspected on 2026-09-17.

| Backend endpoint | API function | React Query hook / action | Screen |
|---|---|---|---|
| `POST /auth/login` | `authApi.login` | Auth context mutation | Login |
| `POST /auth/register` | `authApi.register` | Auth context mutation | Registration |
| `POST /auth/refresh` | Axios response interceptor | Automatic single-flight refresh | All protected screens |
| `GET /subscriptions` | `subscriptionsApi.list` | `useSubscriptions` | Dashboard, subscription list |
| `POST /subscriptions` | `subscriptionsApi.create` | `useCreateSubscription` | Add subscription |
| `GET /subscriptions/{id}` | `subscriptionsApi.get` | `useSubscription` | Details, edit |
| `PUT /subscriptions/{id}` | `subscriptionsApi.update` | `useUpdateSubscription` | Edit subscription |
| `DELETE /subscriptions/{id}` | `subscriptionsApi.remove` | `useDeleteSubscription` | Details, subscription list |
| `GET /statistics/summary` | `statisticsApi.summary` | `useSummary` | Dashboard |
| `GET /statistics/monthly-dynamics` | `statisticsApi.monthlyDynamics` | `useMonthlyDynamics` | Dashboard |
| `GET /reports/annual.csv` | `downloadAnnualReport('csv')` | Direct authenticated download action | Reports |
| `GET /reports/annual.xlsx` | `downloadAnnualReport('xlsx')` | Direct authenticated download action | Reports |
| `GET /admin/statistics/service-usage` | `statisticsApi.adminUsage` | `useAdminUsage` | Service usage |

OpenAPI declares global JWT bearer authentication. The API does not expose a current-user endpoint or a role DTO. The UI therefore stores only the login email for account display and relies on the backend's `403` response for the admin usage permission state.

