import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { adminApi } from '@/api/endpoints/admin'
import type { AdminRole } from '@/features/admin/types'

function describeRoleError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.data?.code === 'LAST_ADMIN')
    return 'You can’t remove the last admin. Make someone else an admin first.'
  return 'Couldn’t change the role. Try again.'
}

export function useChangeRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: AdminRole }) => adminApi.changeRole(id, role),
    onSuccess: (user) => {
      toast.success(user.role === 'ADMIN' ? 'Admin role granted' : 'Admin role removed')
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error) => toast.error(describeRoleError(error)),
  })
}
