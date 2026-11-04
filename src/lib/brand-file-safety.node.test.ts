import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { checkLogoFile, detectLogoType, findSvgProblems, MAX_LOGO_BYTES } from './brand-file-safety.ts'

const CLEAN_SVG = readFileSync(new URL('../assets/brands/netflix.svg', import.meta.url), 'utf8')
const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
const WEBP_BYTES = new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 ')

function svg(inner: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`
}

describe('brand file safety', () => {
  it('accepts a clean single-path SVG logo', () => {
    // then
    expect(findSvgProblems(CLEAN_SVG)).toEqual([])
  })

  it.each([
    ['<script>alert(1)</script>', 'scripts'],
    ['<path onload="alert(1)" d="M0 0"/>', 'event handlers'],
    ['<a href="javascript:alert(1)"><path d="M0 0"/></a>', 'javascript: links'],
    ['<use href="https://evil.example/x.svg#a"/>', 'external links'],
    ['<use xlink:href="//evil.example/x.svg#a"/>', 'external links'],
    ['<foreignObject><div>x</div></foreignObject>', 'embedded content'],
    ['<iframe src="https://evil.example"></iframe>', 'embedded content'],
    ['<image href="#a"/>', 'embedded images'],
    ['<path fill="url(https://evil.example/p)" d="M0 0"/>', 'CSS url() or @import'],
    ['<style>@import "https://evil.example/a.css";</style>', 'CSS url() or @import'],
    ['<path d="data:text/html;base64,AAAA"/>', 'data: content'],
  ])('rejects SVG with %s', (inner, problem) => {
    // then
    expect(findSvgProblems(svg(inner))).toContain(problem)
  })

  it('rejects SVG that declares entities or a doctype', () => {
    // then
    expect(findSvgProblems(`<!DOCTYPE svg [<!ENTITY x "y">]>${svg('')}`)).toContain('doctype or entities')
  })

  it('allows links to its own fragments', () => {
    // then
    expect(findSvgProblems(svg('<defs><path id="a" d="M0 0"/></defs><use href="#a"/>'))).toEqual([])
  })

  it('recognises PNG, WebP and SVG by their bytes, not their name', () => {
    // then
    expect(detectLogoType(PNG_BYTES)).toBe('png')
    expect(detectLogoType(WEBP_BYTES)).toBe('webp')
    expect(detectLogoType(new TextEncoder().encode(CLEAN_SVG))).toBe('svg')
    expect(detectLogoType(new TextEncoder().encode('GIF89a'))).toBeNull()
  })

  it('fails with a clear message for unsafe, unknown or oversized files', () => {
    // then
    expect(() => checkLogoFile(new TextEncoder().encode(svg('<script>x</script>')))).toThrow(
      'The SVG is not safe to use: scripts.',
    )
    expect(() => checkLogoFile(new TextEncoder().encode('GIF89a'))).toThrow('Only SVG, PNG or WebP logos are allowed.')
    expect(() => checkLogoFile(new Uint8Array(MAX_LOGO_BYTES + 1))).toThrow('The logo is larger than 256 KB.')
    expect(checkLogoFile(PNG_BYTES)).toEqual({ type: 'png' })
  })
})
