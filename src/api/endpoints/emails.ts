import { api } from '@/api/client'
import type { BillingEmail, EmailContent } from '@/types/api'

export const emailsApi = {
  listForSubscription: async (subscriptionId: number) =>
    (await api.get<BillingEmail[]>(`/subscriptions/${subscriptionId}/emails`)).data,
  getContent: async (emailId: number, showImages: boolean): Promise<EmailContent> => {
    const response = await api.get<string>(`/emails/${emailId}/content`, {
      params: { images: showImages },
      responseType: 'text',
    })
    return {
      html: response.data,
      contentSecurityPolicy: (response.headers['content-security-policy'] as string | undefined) ?? null,
      blockedRemoteImages: Number(response.headers['x-blocked-remote-images']) || 0,
    }
  },
  getAttachment: async (emailId: number, attachmentId: number) =>
    (
      await api.get<Blob>(`/emails/${emailId}/attachments/${attachmentId}`, {
        params: { download: true },
        responseType: 'blob',
      })
    ).data,
}
