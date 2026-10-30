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
| `GET /me/gmail` | `gmailApi.getConnection` | `useGmailConnection` | Dashboard Gmail card |
| `POST /gmail/sync` | `gmailApi.requestSync` | `useRequestSync` | Dashboard Gmail card |
| `GET /gmail/sync-status` | `gmailApi.getSyncStatus` | `useSyncStatus` (polls while running) | Dashboard Gmail card |
| `POST /subscriptions/{id}/hide` | `subscriptionsApi.hide` | `useSetSubscriptionHidden` | Details, subscription list |
| `POST /subscriptions/{id}/unhide` | `subscriptionsApi.unhide` | `useSetSubscriptionHidden` | Details, subscription list (Show hidden) |
| `PUT /subscriptions/{id}` (unchanged) | `subscriptionsApi.update` | `useConfirmGuessedDetails` | Dashboard Needs review, details |
| `GET /subscriptions/{id}/emails` | `emailsApi.listForSubscription` | `useBillingEmails` | Subscription details (Billing emails) |
| `GET /emails/{id}/content` | `emailsApi.getContent` | `useEmailContent` | Email viewer (sandboxed iframe) |
| `GET /emails/{id}/attachments/{attachmentId}` | `emailsApi.getAttachment` | `downloadAttachment` | Billing emails attachments |
