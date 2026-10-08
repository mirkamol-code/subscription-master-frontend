import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStore } from '@/lib/token-store'
import type { TokenResponse } from '@/types/api'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required')
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20_000,
})

const refreshClient = axios.create({ baseURL: API_BASE_URL, timeout: 20_000 })
let refreshPromise: Promise<string> | null = null

api.interceptors.request.use((config) => {
  const accessToken = tokenStore.get()?.accessToken
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    const isAuthRequest = config?.url?.startsWith('/auth/')
    const session = tokenStore.get()

    if (error.response?.status === 401 && config && !config._retry && !isAuthRequest && session) {
      config._retry = true
      refreshPromise ??= refreshClient
        .post<TokenResponse>('/auth/refresh', { refreshToken: session.refreshToken })
        .then(({ data }) => tokenStore.set(data).accessToken)
        .finally(() => {
          refreshPromise = null
        })

      try {
        const accessToken = await refreshPromise
        config.headers.Authorization = `Bearer ${accessToken}`
        return api(config)
      } catch {
        tokenStore.clear()
        if (window.location.pathname !== '/login') window.location.assign('/login?expired=1')
      }
    }

    return Promise.reject(error)
  },
)

export function getApiError(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Something went wrong. Please try again.'
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.'
  const data = error.response.data as Record<string, unknown> | string | undefined
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object' && typeof data.message === 'string') return data.message
  if (data && typeof data === 'object' && typeof data.detail === 'string') return data.detail
  if (error.response.status === 400) return 'Please review the highlighted information.'
  if (error.response.status === 403) return 'You do not have permission to perform this action.'
  if (error.response.status >= 500) return 'The server could not complete the request. Please try again.'
  return 'The request could not be completed.'
}
