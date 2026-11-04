import { describe, expect, it } from 'vitest'
import { buildBrandLogos, getBrandLogo } from '@/lib/brand-logos'
import type { BrandEntry } from '@/lib/brand-registry'

function buildEntry(changes: Partial<BrandEntry>): BrandEntry {
  return {
    key: 'netflix',
    title: 'Netflix',
    file: 'netflix.svg',
    status: 'approved',
    source: 'https://cdn.example.com/netflix.svg',
    added: '2026-11-04',
    sha256: 'abc',
    tint: '#E50914',
    guidelines: '',
    notes: '',
    ...changes,
  }
}

const URLS = { 'netflix.svg': '/assets/netflix.svg', 'acme-notes.png': '/assets/acme-notes.png' }

describe('brand logos', () => {
  it('shows an approved logo with its tint', () => {
    // when
    const logos = buildBrandLogos([buildEntry({})], URLS)

    // then
    expect(logos.get('netflix')).toEqual({ src: '/assets/netflix.svg', title: 'Netflix', tint: '#E50914' })
  })

  it('shows a full-colour logo when no tint is set, and the theme colour for "theme"', () => {
    // when
    const logos = buildBrandLogos(
      [buildEntry({ key: 'acme-notes', title: 'Acme Notes', file: 'acme-notes.png', tint: '' }), buildEntry({ tint: 'theme' })],
      URLS,
    )

    // then
    expect(logos.get('acme-notes')?.tint).toBeNull()
    expect(logos.get('netflix')?.tint).toBe('currentColor')
  })

  it('hides pending or rejected logos and rows without a file', () => {
    // when
    const logos = buildBrandLogos(
      [buildEntry({ status: 'pending' }), buildEntry({ key: 'spotify', file: 'spotify.svg' }), buildEntry({ key: 'hetzner', status: 'rejected' })],
      URLS,
    )

    // then
    expect(logos.size).toBe(0)
  })

  it('never matches a similar but different key', () => {
    // then
    expect(getBrandLogo('netflix-mail-example')).toBeNull()
    expect(getBrandLogo('Netflix')).toBeNull()
    expect(getBrandLogo(null)).toBeNull()
  })

  it('shows no logo for a merchant listed twice', () => {
    // when
    const logos = buildBrandLogos([buildEntry({}), buildEntry({ status: 'rejected' })], URLS)

    // then
    expect(logos.has('netflix')).toBe(false)
  })
})
