import { api } from '@/api/client'
import type { TokenResponse } from '@/types/api'

export const authApi = {
  login: async (input: { email: string; password: string }) =>
    (await api.post<TokenResponse>('/auth/login', input)).data,
  register: async (input: { email: string; password: string }) =>
    (await api.post<TokenResponse>('/auth/register', input)).data,
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
}

