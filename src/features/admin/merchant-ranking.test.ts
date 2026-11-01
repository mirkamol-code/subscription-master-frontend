import { describe, expect, it } from 'vitest'
import { findRankExtremes, formatDecimal, formatShare } from '@/features/admin/merchant-ranking'

const merchant = (slug: string, activeSubscribers: number) => ({ slug, activeSubscribers })

describe('findRankExtremes', () => {
  it('marks the first merchant most tracked and the last least tracked', () => {
    // given
    const netflix = merchant('netflix', 9)
    const canva = merchant('canva', 1)

    // when
    const extremes = findRankExtremes([netflix, merchant('notion', 4), canva])

    // then
    expect(extremes).toEqual({ top: netflix, lowest: canva })
  })

  it('names no least-tracked merchant when there is only one', () => {
    // given
    const netflix = merchant('netflix', 9)

    // when
    const extremes = findRankExtremes([netflix])

    // then
    expect(extremes).toEqual({ top: netflix, lowest: null })
  })

  it('names nothing when nothing is tracked', () => {
    // when
    const extremes = findRankExtremes([])

    // then
    expect(extremes).toEqual({ top: null, lowest: null })
  })

  it('names nothing when every merchant ties', () => {
    // when
    const extremes = findRankExtremes([merchant('netflix', 2), merchant('notion', 2)])

    // then
    expect(extremes).toEqual({ top: null, lowest: null })
  })
})

describe('formatShare', () => {
  it('drops a trailing zero but keeps one decimal when needed', () => {
    // then
    expect(formatShare(50)).toBe('50%')
    expect(formatShare(33.3)).toBe('33.3%')
    expect(formatShare(0)).toBe('0%')
  })
})

describe('formatDecimal', () => {
  it('shows a dash when there is nothing to average', () => {
    // then
    expect(formatDecimal(null)).toBe('—')
    expect(formatDecimal(1.25)).toBe('1.3')
  })
})
