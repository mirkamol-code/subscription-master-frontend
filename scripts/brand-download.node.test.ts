import { describe, expect, it } from 'vitest'
import { downloadLogo } from './brand-download.ts'
import { MAX_LOGO_BYTES } from '../src/lib/brand-file-safety.ts'

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])

function respondWith(routes: Record<string, () => Response>): typeof fetch {
  return async (input) => {
    const route = routes[String(input)]
    if (!route) throw new Error(`unexpected request ${String(input)}`)
    return route()
  }
}

function redirectTo(location: string) {
  return () => new Response(null, { status: 302, headers: { location } })
}

function image(bytes: Uint8Array, contentType: string, headers: Record<string, string> = {}) {
  return () => new Response(bytes, { status: 200, headers: { 'content-type': contentType, ...headers } })
}

describe('downloadLogo', () => {
  it('downloads an https logo whose type matches its bytes', async () => {
    // when
    const bytes = await downloadLogo(new URL('https://brand.example/logo.png'),
      respondWith({ 'https://brand.example/logo.png': image(PNG, 'image/png') }))

    // then
    expect(bytes).toEqual(PNG)
  })

  it('follows https redirects but refuses an http hop anywhere in the chain', async () => {
    // when / then
    await expect(downloadLogo(new URL('https://brand.example/logo.png'), respondWith({
      'https://brand.example/logo.png': redirectTo('http://cdn.example/logo.png'),
    }))).rejects.toThrow('Logo URLs must use https://, including redirects.')
  })

  it('stops reading as soon as the logo passes 256 KB, even without a size header', async () => {
    // when / then
    await expect(downloadLogo(new URL('https://brand.example/big.png'), respondWith({
      'https://brand.example/big.png': image(new Uint8Array(MAX_LOGO_BYTES + 10), 'image/png'),
    }))).rejects.toThrow('The logo is larger than 256 KB.')
  })

  it('refuses a file whose real type differs from the type the server claims', async () => {
    // when / then
    await expect(downloadLogo(new URL('https://brand.example/logo.png'), respondWith({
      'https://brand.example/logo.png': image(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), 'image/png'),
    }))).rejects.toThrow('The server says image/png but the file is svg.')
  })

  it('refuses content types other than SVG, PNG or WebP', async () => {
    // when / then
    await expect(downloadLogo(new URL('https://brand.example/logo.gif'), respondWith({
      'https://brand.example/logo.gif': image(new TextEncoder().encode('GIF89a'), 'image/gif'),
    }))).rejects.toThrow('Only SVG, PNG or WebP logos are allowed.')
  })
})
