import { api } from '@/api/client'

export const accountApi = {
  disconnectGmail: async () => (await api.delete<{ googleAccessRevoked: boolean }>('/me/gmail')).data,
  deleteAccount: async () => {
    await api.delete('/me')
  },
}
