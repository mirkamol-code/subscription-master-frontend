import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/endpoints/auth'
import { tokenStore } from '@/lib/token-store'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!tokenStore.get()?.accessToken,
    staleTime: 5 * 60_000,
  })
}

export function useIsAdmin() {
  const query = useCurrentUser()
  return {
    isAdmin: query.data?.roles.some((role) => role === 'ROLE_ADMIN' || role === 'ADMIN') ?? false,
    isLoading: query.isLoading,
  }
}
