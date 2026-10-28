import { api } from '@/api/client'
import type { TokenResponse, UserProfile } from '@/types/api'

export const authApi = {
  login: async (input: { email: string; password: string }) =>
    (await api.post<TokenResponse>('/auth/login', input)).data,
  register: async (input: { email: string; password: string }) =>
    (await api.post<TokenResponse>('/auth/register', input)).data,
  me: async () => (await api.get<UserProfile>('/auth/me')).data,
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
}

