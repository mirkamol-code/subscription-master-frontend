import { detectLogoType, MAX_LOGO_BYTES, TOO_LARGE, UNSUPPORTED_TYPE, type LogoType } from '../src/lib/brand-file-safety.ts'

const MAX_REDIRECTS = 5
const CONTENT_TYPES: Readonly<Record<string, LogoType>> = {
  'image/svg+xml': 'svg',
  'image/png': 'png',
  'image/webp': 'webp',
}

async function followHttpsRedirects(url: URL, fetchLogo: typeof fetch): Promise<Response> {
  let current = url
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (current.protocol !== 'https:') throw new Error('Logo URLs must use https://, including redirects.')
    const response = await fetchLogo(current, { redirect: 'manual' })
    const location = response.headers.get('location')
    if (response.status < 300 || response.status >= 400 || !location) return response
    current = new URL(location, current)
  }
  throw new Error(`The logo URL redirected more than ${MAX_REDIRECTS} times.`)
}

async function readWithinLimit(response: Response): Promise<Uint8Array> {
  if (Number(response.headers.get('content-length') ?? 0) > MAX_LOGO_BYTES) throw new Error(TOO_LARGE)
  if (!response.body) return new Uint8Array()
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    size += next.value.length
    if (size > MAX_LOGO_BYTES) {
      await reader.cancel()
      throw new Error(TOO_LARGE)
    }
    chunks.push(next.value)
  }
  const bytes = new Uint8Array(size)
  chunks.reduce((offset, chunk) => (bytes.set(chunk, offset), offset + chunk.length), 0)
  return bytes
}

export async function downloadLogo(url: URL, fetchLogo: typeof fetch = fetch): Promise<Uint8Array> {
  const response = await followHttpsRedirects(url, fetchLogo)
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`)
  const contentType = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  const declaredType = CONTENT_TYPES[contentType]
  if (!declaredType) throw new Error(UNSUPPORTED_TYPE)
  const bytes = await readWithinLimit(response)
  const actualType = detectLogoType(bytes)
  if (actualType !== declaredType) throw new Error(`The server says ${contentType} but the file is ${actualType ?? 'not a logo'}.`)
  return bytes
}
