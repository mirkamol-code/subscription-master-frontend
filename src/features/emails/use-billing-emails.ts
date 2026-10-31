import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { emailsApi } from '@/api/endpoints/emails'
import { subscriptionsApi } from '@/api/endpoints/subscriptions'
import { refreshSubscriptionData } from '@/hooks/use-subscriptions'
import type { ReceiptAmountRequest } from '@/types/api'

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

export function useEmailContent(emailId: number, isShowingImages: boolean) {
  return useQuery({
    queryKey: emailKeys.content(emailId, isShowingImages),
    queryFn: () => emailsApi.getContent(emailId, isShowingImages),
    staleTime: Infinity,
  })
}

export function useConfirmReceiptAmount(subscriptionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ emailId, input }: { emailId: number; input: ReceiptAmountRequest }) =>
      subscriptionsApi.confirmReceiptAmount(subscriptionId, emailId, input),
    onSuccess: (data) => {
      refreshSubscriptionData(queryClient, data)
      void queryClient.invalidateQueries({ queryKey: emailKeys.forSubscription(subscriptionId) })
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        refreshSubscriptionData(queryClient)
        void queryClient.invalidateQueries({ queryKey: emailKeys.forSubscription(subscriptionId) })
      }
    },
  })
}
