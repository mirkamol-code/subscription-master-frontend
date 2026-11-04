import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { findSvgProblems } from './brand-file-safety.ts'
import { isValidMerchantKey, parseBrandRegistry } from './brand-registry.ts'

const BRANDS_DIR = new URL('../assets/brands/', import.meta.url)
const ENTRIES = parseBrandRegistry(readFileSync(new URL('BRANDS.md', BRANDS_DIR), 'utf8'))
const LOGO_FILES = readdirSync(BRANDS_DIR).filter((name) => /\.(svg|png|webp)$/.test(name))

describe('bundled brand logos', () => {
  it('records every logo file in BRANDS.md with a matching checksum', () => {
    // then
    for (const name of LOGO_FILES) {
      const entry = ENTRIES.find((candidate) => candidate.file === name)
      expect(entry, `${name} has no row in BRANDS.md`).toBeDefined()
      const checksum = createHash('sha256').update(readFileSync(new URL(name, BRANDS_DIR))).digest('hex')
      expect(entry?.sha256, `${name} checksum`).toBe(checksum)
    }
  })

  it('has a file for every approved row and none for rejected rows', () => {
    // then
    for (const entry of ENTRIES) {
      if (entry.status === 'approved') expect(LOGO_FILES, `${entry.key} is approved`).toContain(entry.file)
      if (entry.status === 'rejected') expect(LOGO_FILES, `${entry.key} is rejected`).not.toContain(entry.file)
    }
  })

  it('uses exact merchant keys and https sources only', () => {
    // then
    for (const entry of ENTRIES) {
      expect(isValidMerchantKey(entry.key), entry.key).toBe(true)
      if (entry.source && !entry.source.startsWith('local file:')) expect(entry.source, entry.key).toMatch(/^https:\/\//)
    }
  })

  it('keeps every bundled SVG free of unsafe content', () => {
    // then
    for (const name of LOGO_FILES.filter((file) => file.endsWith('.svg')))
      expect(findSvgProblems(readFileSync(new URL(name, BRANDS_DIR), 'utf8')), name).toEqual([])
  })
})
