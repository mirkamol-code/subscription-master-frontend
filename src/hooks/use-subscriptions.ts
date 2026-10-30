import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/api/endpoints/subscriptions'
import type { Subscription, SubscriptionFilters, SubscriptionRequest, SubscriptionStatus } from '@/types/api'

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: SubscriptionFilters) => [...subscriptionKeys.lists(), filters] as const,
  allList: () => [...subscriptionKeys.all, 'all-items'] as const,
  detail: (id: number) => [...subscriptionKeys.all, 'detail', id] as const,
  history: (id: number) => [...subscriptionKeys.detail(id), 'history'] as const,
  statusHistory: (id: number) => [...subscriptionKeys.detail(id), 'status-history'] as const,
}

const statisticsKeys = { all: ['statistics'] as const }

const FALLBACK_PAGE_SIZE = 100

/** Any change to a subscription also changes the totals and charts built from it. */
export function refreshSubscriptionData(queryClient: QueryClient, updated?: Subscription) {
  if (updated) queryClient.setQueryData(subscriptionKeys.detail(updated.id), updated)
  void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
  void queryClient.invalidateQueries({ queryKey: statisticsKeys.all })
}

/** Every subscription; reads the paged list page by page if the unpaged list is unavailable. */
export async function fetchAllSubscriptions(): Promise<Subscription[]> {
  try {
    return await subscriptionsApi.listAll()
  } catch {
    const items: Subscription[] = []
    for (let page = 0; ; page++) {
      const result = await subscriptionsApi.list({ page, size: FALLBACK_PAGE_SIZE })
      items.push(...result.content)
      if (result.last || result.content.length === 0) return items
    }
  }
}

export function useSubscriptions(filters: SubscriptionFilters) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionsApi.list(filters),
    placeholderData: (previous) => previous,
  })
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.allList(),
    queryFn: fetchAllSubscriptions,
  })
}

export function useSubscriptionHistory(id: number) {
  return useQuery({
    queryKey: subscriptionKeys.history(id),
    queryFn: () => subscriptionsApi.getHistory(id),
    enabled: Number.isFinite(id),
  })
}

export function useStatusHistory(id: number) {
  return useQuery({
    queryKey: subscriptionKeys.statusHistory(id),
    queryFn: () => subscriptionsApi.getStatusHistory(id),
    enabled: Number.isFinite(id),
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
    onSuccess: () => refreshSubscriptionData(queryClient),
  })
}

export function useUpdateSubscription(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubscriptionRequest) => subscriptionsApi.update(id, input),
    onSuccess: (data) => refreshSubscriptionData(queryClient, data),
  })
}

export function useChangeSubscriptionStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SubscriptionStatus }) =>
      subscriptionsApi.changeStatus(id, status),
    onSuccess: (data) => refreshSubscriptionData(queryClient, data),
  })
}

/** Saving a subscription unchanged tells the backend its guessed details are right. */
export function useConfirmSubscriptionReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name, price, currency, frequency, status, category, startDate, version }: Subscription) =>
      subscriptionsApi.update(id, { name, price, currency, frequency, status, category, startDate, version }),
    onSuccess: (data) => refreshSubscriptionData(queryClient, data),
  })
}

export function useSetSubscriptionHidden() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, hidden }: { id: number; hidden: boolean }) =>
      hidden ? subscriptionsApi.hide(id) : subscriptionsApi.unhide(id),
    onSuccess: (data) => refreshSubscriptionData(queryClient, data),
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionsApi.remove,
    onSuccess: () => refreshSubscriptionData(queryClient),
  })
}
