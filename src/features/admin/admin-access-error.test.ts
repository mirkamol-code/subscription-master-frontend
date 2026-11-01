import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { isForbiddenOrMissing } from '@/features/admin/admin-access-error'

function apiError(status: number) {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('failed', 'ERR', config, null, { status, statusText: '', headers: {}, config, data: {} })
}

describe('isForbiddenOrMissing', () => {
  it('treats a lost admin role and an unknown user as not found', () => {
    // then
    expect(isForbiddenOrMissing(apiError(403))).toBe(true)
    expect(isForbiddenOrMissing(apiError(404))).toBe(true)
  })

  it('keeps server failures and network errors retryable', () => {
    // then
    expect(isForbiddenOrMissing(apiError(500))).toBe(false)
    expect(isForbiddenOrMissing(new Error('offline'))).toBe(false)
  })
})
