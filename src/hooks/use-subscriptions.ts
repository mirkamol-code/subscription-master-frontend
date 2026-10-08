import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/api/endpoints/subscriptions'
import type { SubscriptionFilters, SubscriptionRequest } from '@/types/api'

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: SubscriptionFilters) => [...subscriptionKeys.lists(), filters] as const,
  detail: (id: number) => [...subscriptionKeys.all, 'detail', id] as const,
}

/** Statistics depend on subscriptions; invalidate them after any mutation. */
const statisticsKeys = { all: ['statistics'] as const }

export function useSubscriptions(filters: SubscriptionFilters) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionsApi.list(filters),
    placeholderData: (previous) => previous,
  })
}

export function useSubscription(id: number) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => subscriptionsApi.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
      void queryClient.invalidateQueries({ queryKey: statisticsKeys.all })
    },
  })
}

export function useUpdateSubscription(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubscriptionRequest) => subscriptionsApi.update(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData(subscriptionKeys.detail(id), data)
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: statisticsKeys.all })
    },
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionsApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
      void queryClient.invalidateQueries({ queryKey: statisticsKeys.all })
    },
  })
}
