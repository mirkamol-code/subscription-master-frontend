import { useQuery } from '@tanstack/react-query'
import { emailsApi } from '@/api/endpoints/emails'

export const emailKeys = {
  all: ['emails'] as const,
  forSubscription: (subscriptionId: number) => [...emailKeys.all, 'subscription', subscriptionId] as const,
  content: (emailId: number, showImages: boolean) => [...emailKeys.all, 'content', emailId, showImages] as const,
}

export function useBillingEmails(subscriptionId: number) {
  return useQuery({
    queryKey: emailKeys.forSubscription(subscriptionId),
    queryFn: () => emailsApi.listForSubscription(subscriptionId),
    enabled: Number.isFinite(subscriptionId),
  })
}

export function useEmailContent(emailId: number | null, showImages: boolean) {
  return useQuery({
    queryKey: emailKeys.content(emailId ?? -1, showImages),
    queryFn: () => emailsApi.getContent(emailId as number, showImages),
    enabled: emailId !== null,
    staleTime: Infinity,
  })
}
