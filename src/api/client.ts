import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStore } from '@/lib/token-store'
import type { TokenResponse } from '@/types/api'

// Falls back to the relative path '/api', which works when the SPA is served
// behind an Nginx reverse proxy that forwards /api → the backend.
// Override with VITE_API_BASE_URL in .env.development for local dev.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'

if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    '[api/client] VITE_API_BASE_URL is not set — falling back to "/api". ' +
      'Make sure the Vite dev proxy is configured in vite.config.ts.',
  )
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
    const isPublicAuthRequest = /^\/auth\/(exchange|refresh|logout)\b/.test(
      config?.url ?? '',
    )
    const session = tokenStore.get()

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !isPublicAuthRequest &&
      session?.refreshToken
    ) {
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

// Server messages that read like stack traces or validation internals are never shown to users.
const TECHNICAL_MESSAGE =
  /<[a-z][\s\S]*>|exception|java\.|org\.|sql|jdbc|hibernate|constraint|stack ?trace|null ?pointer|object=|field=|rejected value|endpoint|backend|api\b|https?:\/\//i

function toFriendlyMessage(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 180 || TECHNICAL_MESSAGE.test(trimmed)) return null
  return trimmed
}

function extractServerMessage(data: unknown): string | null {
  if (typeof data === 'string') return toFriendlyMessage(data)
  if (!data || typeof data !== 'object' || data instanceof Blob) return null

  const record = data as Record<string, unknown>
  // Field problems are shown next to each field (see getFieldErrors), not as one vague banner.
  if (record.fields || record.fieldErrors) return null
  const direct = toFriendlyMessage(record.message) ?? toFriendlyMessage(record.detail)
  if (direct) return direct

  if (record.errors && typeof record.errors === 'object') {
    for (const value of Object.values(record.errors as Record<string, unknown>)) {
      const message = toFriendlyMessage(value)
      if (message) return message
    }
  }
  return null
}

function statusMessage(status: number): string {
  if (status === 400 || status === 422) return 'Please check the details you entered and try again.'
  if (status === 401) return 'Your session has ended. Please sign in again.'
  if (status === 403) return 'You don’t have access to this page.'
  if (status === 404) return 'We couldn’t find what you were looking for.'
  if (status === 409) return 'This was changed somewhere else. Refresh the page and try again.'
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.'
  if (status === 503) return 'The service is temporarily unavailable. Please try again in a few minutes.'
  return 'Something went wrong on our side. Please try again in a moment.'
}

/** The server's per-field validation messages, e.g. { email: 'Must be a well-formed email address' }. */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return {}
  const data = error.response.data as
    | { fields?: Record<string, unknown>; fieldErrors?: Array<{ field?: unknown; message?: unknown }> }
    | null
    | undefined
  const entries: Array<[unknown, unknown]> = data?.fields
    ? Object.entries(data.fields)
    : (data?.fieldErrors ?? []).map((item) => [item.field, item.message])

  const result: Record<string, string> = {}
  for (const [field, message] of entries) {
    const friendly = toFriendlyMessage(message)
    if (typeof field === 'string' && friendly && !result[field]) {
      result[field] = friendly.charAt(0).toUpperCase() + friendly.slice(1)
    }
  }
  return result
}

export function getApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.'
  }

  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'This is taking longer than usual. Please try again.'
      : 'You appear to be offline. Check your connection and try again.'
  }

  const { status, data } = error.response

  if ((data as { errorCode?: string } | null)?.errorCode === 'EXCHANGE_RATES_UNAVAILABLE') {
    return 'Exchange rates are temporarily unavailable, so amounts in UZS can’t be shown right now. Please try again in a few minutes.'
  }

  // 5xx bodies are never meant for end users.
  if (status < 500) {
    const serverMessage = extractServerMessage(data)
    if (serverMessage) return serverMessage
  }
  return statusMessage(status)
}
