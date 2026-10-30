import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { getApiError, getFieldErrors } from '@/api/client'

function httpError(status: number, data: unknown, url = '/auth/register') {
  const config = { url, headers: new AxiosHeaders() }
  const response = { status, data, headers: {}, config, statusText: '' } as AxiosResponse
  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, null, response)
}

// The exact body the backend returns for an invalid registration.
const validationError = {
  status: 400,
  code: 'VALIDATION_ERROR',
  errorCode: 'VALIDATION_ERROR',
  message: 'Invalid input fields',
  fields: {
    email: 'must be a well-formed email address',
    password: 'size must be between 12 and 72',
  },
  fieldErrors: [
    { field: 'email', message: 'must be a well-formed email address' },
    { field: 'password', message: 'size must be between 12 and 72' },
  ],
}

describe('getFieldErrors', () => {
  it('returns each field’s message, capitalised', () => {
    expect(getFieldErrors(httpError(400, validationError))).toEqual({
      email: 'Must be a well-formed email address',
      password: 'Size must be between 12 and 72',
    })
  })

  it('reads the fieldErrors list when there is no fields map', () => {
    const data = { fieldErrors: [{ field: 'name', message: 'must not be blank' }] }
    expect(getFieldErrors(httpError(400, data))).toEqual({ name: 'Must not be blank' })
  })

  it('never shows technical server text', () => {
    const data = { fields: { price: 'java.lang.NumberFormatException' } }
    expect(getFieldErrors(httpError(400, data))).toEqual({})
  })

  it('ignores anything that is not a 400', () => {
    expect(getFieldErrors(httpError(409, validationError))).toEqual({})
    expect(getFieldErrors(new Error('boom'))).toEqual({})
  })
})

describe('getApiError', () => {
  it('uses a plain banner when the problems are shown per field', () => {
    expect(getApiError(httpError(400, validationError))).toBe(
      'Please check the details you entered and try again.',
    )
  })

  it('still shows a friendly server message when there are no field errors', () => {
    expect(getApiError(httpError(400, { message: 'Unsupported year' }, '/statistics/summary'))).toBe(
      'Unsupported year',
    )
  })

  it('explains a missing exchange rate', () => {
    const data = { status: 503, errorCode: 'EXCHANGE_RATES_UNAVAILABLE', message: 'Exchange rates temporarily unavailable' }
    expect(getApiError(httpError(503, data, '/statistics/summary'))).toMatch(/^Exchange rates are temporarily unavailable/)
  })

  it('shows why a Login code was rejected, not an expired session', () => {
    const data = { status: 401, message: 'Invalid or expired login code' }
    expect(getApiError(httpError(401, data, '/auth/exchange'))).toBe('Invalid or expired login code')
  })
})
