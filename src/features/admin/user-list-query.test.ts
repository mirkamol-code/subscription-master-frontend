import { describe, expect, it } from 'vitest'
import { readUserListFilters, toUserListParams } from '@/features/admin/user-list-query'

describe('readUserListFilters', () => {
  it('falls back to newest signups first when the address has no filters', () => {
    // when
    const filters = readUserListFilters(new URLSearchParams())

    // then
    expect(filters).toEqual({
      search: '',
      joined: '',
      loggedIn: '',
      status: '',
      merchant: '',
      sort: 'createdAt,DESC',
      page: 0,
    })
  })

  it('ignores filter values the admin API does not accept', () => {
    // when
    const filters = readUserListFilters(
      new URLSearchParams('joined=999&loggedIn=abc&status=PAUSED&sort=googleSubject,ASC&page=-3'),
    )

    // then
    expect(filters).toMatchObject({ joined: '', loggedIn: '', status: '', sort: 'createdAt,DESC', page: 0 })
  })

  it('keeps every sort the column headers can produce', () => {
    // given
    const headerSorts = ['email,ASC', 'email,DESC', 'createdAt,ASC', 'createdAt,DESC', 'lastLoginAt,ASC', 'lastLoginAt,DESC']

    // when
    const kept = headerSorts.map((sort) => readUserListFilters(new URLSearchParams({ sort })).sort)

    // then
    expect(kept).toEqual(headerSorts)
  })
})

describe('toUserListParams', () => {
  it('sends only the filters the admin has set', () => {
    // when
    const params = toUserListParams(readUserListFilters(new URLSearchParams()))

    // then
    expect(params).toEqual({ page: 0, size: 20, sort: 'createdAt,DESC' })
  })

  it('maps every filter to the admin users API parameters', () => {
    // given
    const filters = readUserListFilters(
      new URLSearchParams(
        'search=%20alice%20&joined=7&loggedIn=1&status=BILLING_REQUIRED&merchant=netflix&sort=lastLoginAt,DESC&page=2',
      ),
    )

    // when
    const params = toUserListParams(filters)

    // then
    expect(params).toEqual({
      search: 'alice',
      joinedWithinDays: 7,
      loggedInWithinDays: 1,
      status: 'BILLING_REQUIRED',
      merchant: 'netflix',
      sort: 'lastLoginAt,DESC',
      page: 2,
      size: 20,
    })
  })
})
