import { describe, expect, it, vi } from 'vitest'
import { createLoginCodeExchanger, readLoginCallback } from '@/features/auth/login-callback'
import type { TokenResponse } from '@/types/api'

const tokens: TokenResponse = {
  accessToken: 'access',
  refreshToken: 'refresh',
  tokenType: 'Bearer',
  expiresInSeconds: 900,
}

describe('readLoginCallback', () => {
  it('reads the Login code the backend sends back', () => {
    // given
    const params = new URLSearchParams('code=abc123')

    // when
    const callback = readLoginCallback(params)

    // then
    expect(callback).toEqual({ kind: 'code', code: 'abc123' })
  })

  it('reports a failed Google login', () => {
    // given
    const params = new URLSearchParams('error=google_login_failed')

    // when
    const callback = readLoginCallback(params)

    // then
    expect(callback).toEqual({ kind: 'error' })
  })

  it.each(['', 'code=', 'code=%20'])('treats "%s" as a missing Login code', (query) => {
    // given
    const params = new URLSearchParams(query)

    // when
    const callback = readLoginCallback(params)

    // then
    expect(callback).toEqual({ kind: 'missing' })
  })
})

describe('createLoginCodeExchanger', () => {
  it('shares one request between two calls with the same Login code', async () => {
    // given
    const exchange = vi.fn(async () => tokens)
    const exchangeLoginCodeOnce = createLoginCodeExchanger(exchange)

    // when
    const results = await Promise.all([exchangeLoginCodeOnce('abc123'), exchangeLoginCodeOnce('abc123')])

    // then
    expect(exchange).toHaveBeenCalledTimes(1)
    expect(exchange).toHaveBeenCalledWith('abc123')
    expect(results).toEqual([tokens, tokens])
  })

  it('does not block a later call with a different Login code', async () => {
    // given
    const otherTokens = { ...tokens, accessToken: 'other-access' }
    const exchange = vi.fn(async (code: string) => (code === 'first' ? tokens : otherTokens))
    const exchangeLoginCodeOnce = createLoginCodeExchanger(exchange)
    await exchangeLoginCodeOnce('first')

    // when
    const result = await exchangeLoginCodeOnce('second')

    // then
    expect(exchange).toHaveBeenCalledTimes(2)
    expect(exchange).toHaveBeenLastCalledWith('second')
    expect(result).toEqual(otherTokens)
  })

  it('passes a failed exchange on to both callers', async () => {
    // given
    const failure = new Error('Login code expired')
    const exchange = vi.fn(async () => {
      throw failure
    })
    const exchangeLoginCodeOnce = createLoginCodeExchanger(exchange)

    // when
    const results = await Promise.allSettled([exchangeLoginCodeOnce('abc123'), exchangeLoginCodeOnce('abc123')])

    // then
    expect(exchange).toHaveBeenCalledTimes(1)
    expect(results).toEqual([
      { status: 'rejected', reason: failure },
      { status: 'rejected', reason: failure },
    ])
  })
})
