import { authApi } from '@/api/endpoints/auth'
import type { TokenResponse } from '@/types/api'

export type LoginCode = string

export type LoginCallback = { kind: 'code'; code: LoginCode } | { kind: 'error' } | { kind: 'missing' }

type ExchangeLoginCode = (code: LoginCode) => Promise<TokenResponse>

const LOGIN_FAILED_ERROR = 'google'

export const LOGIN_FAILED_PATH = `/login?error=${LOGIN_FAILED_ERROR}`

export function hasLoginFailed(params: URLSearchParams): boolean {
  return params.get('error') === LOGIN_FAILED_ERROR
}

export function readLoginCallback(params: URLSearchParams): LoginCallback {
  if (params.has('error')) return { kind: 'error' }
  const code = params.get('code')?.trim()
  return code ? { kind: 'code', code } : { kind: 'missing' }
}

export function createLoginCodeExchanger(exchange: ExchangeLoginCode): ExchangeLoginCode {
  let pending: { code: LoginCode; tokens: Promise<TokenResponse> } | null = null
  return (code) => {
    if (pending?.code !== code) pending = { code, tokens: exchange(code) }
    return pending.tokens
  }
}

export const exchangeLoginCodeOnce = createLoginCodeExchanger(authApi.exchange)
