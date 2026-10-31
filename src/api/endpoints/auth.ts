import { api, API_BASE_URL } from '@/api/client'
import type { TokenResponse, UserProfile } from '@/types/api'

   // Google login starts on the backend's own domain when VITE_AUTH_BASE_URL is set,
   // so the whole OAuth round trip stays on one host. Falls back to the API base URL.
   const AUTH_BASE_URL =
     (import.meta.env.VITE_AUTH_BASE_URL as string | undefined)?.replace(/\/$/, '') || API_BASE_URL

   export const GOOGLE_LOGIN_URL = `${AUTH_BASE_URL}/oauth2/authorization/google`
export const authApi = {
  exchange: async (code: string) => (await api.post<TokenResponse>('/auth/exchange', { code })).data,
  me: async () => (await api.get<UserProfile>('/auth/me')).data,
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
}
