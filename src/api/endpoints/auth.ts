import { api, API_BASE_URL } from '@/api/client'
import type { TokenResponse, UserProfile } from '@/types/api'

export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`

export const authApi = {
  exchange: async (code: string) => (await api.post<TokenResponse>('/auth/exchange', { code })).data,
  me: async () => (await api.get<UserProfile>('/auth/me')).data,
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
}
