import { describe, expect, it } from 'vitest'
import {
  isValidMerchantKey,
  parseBrandRegistry,
  requireApprovedEntry,
  requireHttpsUrl,
  updateBrandEntry,
} from '@/lib/brand-registry'

const MARKDOWN = `# Brand logos

Some rules.

## Registry

| Key | Title | File | Status | Source | Added | SHA-256 | Tint | Guidelines |
|---|---|---|---|---|---|---|---|---|
| netflix | Netflix | netflix.svg | approved | https://cdn.example.com/netflix.svg | 2026-11-04 | abc123 | #E50914 | https://brand.example.com |
| acme-notes | Acme Notes | — | pending | https://acme.example/logo.png | — | — | — | — |
`

describe('brand registry', () => {
  it('reads every row of the registry table', () => {
    // when
    const entries = parseBrandRegistry(MARKDOWN)

    // then
    expect(entries).toEqual([
      {
        key: 'netflix',
        title: 'Netflix',
        file: 'netflix.svg',
        status: 'approved',
        source: 'https://cdn.example.com/netflix.svg',
        added: '2026-11-04',
        sha256: 'abc123',
        tint: '#E50914',
        guidelines: 'https://brand.example.com',
      },
      {
        key: 'acme-notes',
        title: 'Acme Notes',
        file: '',
        status: 'pending',
        source: 'https://acme.example/logo.png',
        added: '',
        sha256: '',
        tint: '',
        guidelines: '',
      },
    ])
  })

  it('refuses a merchant whose row is not approved', () => {
    // when / then
    expect(() => requireApprovedEntry(parseBrandRegistry(MARKDOWN), 'acme-notes')).toThrow(
      'acme-notes is "pending" in BRANDS.md. Mark it "approved" after checking its trademark guidelines.',
    )
  })

  it('refuses a merchant with no row', () => {
    // when / then
    expect(() => requireApprovedEntry(parseBrandRegistry(MARKDOWN), 'spotify')).toThrow(
      'spotify has no row in BRANDS.md. Add one and mark it "approved" first.',
    )
  })

  it('records the file, source, date and checksum on the merchant row only', () => {
    // when
    const updated = updateBrandEntry(MARKDOWN, 'acme-notes', {
      file: 'acme-notes.png',
      source: 'https://acme.example/logo.png',
      added: '2026-11-05',
      sha256: 'def456',
    })

    // then
    const entries = parseBrandRegistry(updated)
    expect(entries[1]).toMatchObject({ file: 'acme-notes.png', added: '2026-11-05', sha256: 'def456', status: 'pending' })
    expect(entries[0]).toEqual(parseBrandRegistry(MARKDOWN)[0])
  })

  it('accepts only lowercase merchant keys made of letters, digits and single dashes', () => {
    // then
    expect(isValidMerchantKey('youtube-premium')).toBe(true)
    expect(isValidMerchantKey('Netflix')).toBe(false)
    expect(isValidMerchantKey('../netflix')).toBe(false)
    expect(isValidMerchantKey('netflix--x')).toBe(false)
  })

  it('accepts only https logo URLs', () => {
    // then
    expect(requireHttpsUrl('https://brand.example.com/logo.svg').hostname).toBe('brand.example.com')
    expect(() => requireHttpsUrl('http://brand.example.com/logo.svg')).toThrow('Logo URLs must use https://')
    expect(() => requireHttpsUrl('javascript:alert(1)')).toThrow('Logo URLs must use https://')
  })
})
