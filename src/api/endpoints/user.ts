import { api } from '@/api/client'

export const userApi = {
  disconnectGmail: async () => (await api.delete<{ googleAccessRevoked: boolean }>('/me/gmail')).data,
  deleteUser: async () => {
    await api.delete('/me')
  },
}
