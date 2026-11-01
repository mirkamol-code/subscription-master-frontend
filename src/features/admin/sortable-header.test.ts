import { describe, expect, it } from 'vitest'
import { getHeaderSort } from '@/features/admin/sortable-header'

describe('getHeaderSort', () => {
  it('sorts a new column newest first for dates', () => {
    // when
    const sort = getHeaderSort('createdAt,DESC', 'lastLoginAt')

    // then
    expect(sort).toEqual({ ariaSort: 'none', nextSort: 'lastLoginAt,DESC' })
  })

  it('flips the direction when the active column is clicked again', () => {
    // when
    const sort = getHeaderSort('createdAt,DESC', 'createdAt')

    // then
    expect(sort).toEqual({ ariaSort: 'descending', nextSort: 'createdAt,ASC' })
  })

  it('sorts text columns A to Z first', () => {
    // when
    const sort = getHeaderSort('createdAt,DESC', 'email')

    // then
    expect(sort).toEqual({ ariaSort: 'none', nextSort: 'email,ASC' })
  })
})
