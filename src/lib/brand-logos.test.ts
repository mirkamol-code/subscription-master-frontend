import { describe, expect, it } from 'vitest'
import { getBrandLogo } from '@/lib/brand-logos'

describe('getBrandLogo', () => {
  it('finds the reviewed logo for a known merchant key', () => {
    // when
    const logo = getBrandLogo('netflix')

    // then
    expect(logo?.title).toBe('Netflix')
    expect(logo?.color).toBe('#E50914')
  })

  it('uses the theme colour for near-black brands so they stay visible in dark mode', () => {
    // then
    expect(getBrandLogo('github')?.color).toBe('currentColor')
  })

  it('has no logo for a merchant without a reviewed image', () => {
    // then
    expect(getBrandLogo('adobe')).toBeNull()
    expect(getBrandLogo(null)).toBeNull()
  })

  it('never matches a similar but different key', () => {
    // then
    expect(getBrandLogo('netflix-mail-example')).toBeNull()
    expect(getBrandLogo('Netflix')).toBeNull()
    expect(getBrandLogo('netflixx')).toBeNull()
  })
})
