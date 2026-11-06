import { describe, expect, it } from 'vitest'
import { isLandingPath } from './landing-path'

describe('isLandingPath', () => {
  it('is true for the site root', () => {
    // given
    const pathname = '/'

    // when
    const result = isLandingPath(pathname)

    // then
    expect(result).toBe(true)
  })

  it('is false for app pages that need sign-in', () => {
    // given
    const pathnames = ['/subscriptions', '/settings', '/reports', '/admin']

    // when
    const results = pathnames.map(isLandingPath)

    // then
    expect(results).toEqual([false, false, false, false])
  })
})
