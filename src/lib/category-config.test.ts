import { describe, expect, it } from 'vitest'
import { getCategoryMeta } from '@/lib/category-config'
import type { Category } from '@/types/api'

describe('getCategoryMeta', () => {
  it('labels hosting and server bills as Infrastructure', () => {
    // when
    const meta = getCategoryMeta('INFRASTRUCTURE')

    // then
    expect(meta.label).toBe('Infrastructure')
  })

  it('displays a category it does not know as Other without changing the value it was given', () => {
    // given
    const unknown = 'SPACE_TRAVEL' as Category

    // when
    const meta = getCategoryMeta(unknown)

    // then
    expect(meta.label).toBe('Other')
    expect(unknown).toBe('SPACE_TRAVEL')
  })
})
