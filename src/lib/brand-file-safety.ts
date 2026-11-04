export const MAX_LOGO_BYTES = 256 * 1024
export const TOO_LARGE = 'The logo is larger than 256 KB.'
export const UNSUPPORTED_TYPE = 'Only SVG, PNG or WebP logos are allowed.'

export type LogoType = 'svg' | 'png' | 'webp'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

const SVG_RULES: readonly (readonly [RegExp, string])[] = [
  [/<script\b/i, 'scripts'],
  [/[\s/]on[a-z]+\s*=/i, 'event handlers'],
  [/javascript:/i, 'javascript: links'],
  [/\b(?:xlink:)?href\s*=\s*(?!["']?\s*#)/i, 'external links'],
  [/<(?:set|animate\w*)\b/i, 'animation'],
  [/<style\b[\s\S]*?\\|\bstyle\s*=\s*["'][^"']*\\/i, 'CSS escapes'],
  [/<(?:foreignObject|iframe|embed|object|audio|video|canvas)\b/i, 'embedded content'],
  [/<image\b/i, 'embedded images'],
  [/url\s*\(|@import/i, 'CSS url() or @import'],
  [/data:/i, 'data: content'],
  [/<!DOCTYPE|<!ENTITY/i, 'doctype or entities'],
]

function decodeNumericEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
}

function startsWithBytes(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  return signature.every((byte, index) => bytes[offset + index] === byte)
}

function decodeText(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

export function detectLogoType(bytes: Uint8Array): LogoType | null {
  if (startsWithBytes(bytes, PNG_SIGNATURE)) return 'png'
  const matchesAscii = (offset: number, text: string) => startsWithBytes(bytes, [...text].map((char) => char.charCodeAt(0)), offset)
  if (matchesAscii(0, 'RIFF') && matchesAscii(8, 'WEBP')) return 'webp'
  const head = decodeText(bytes.subarray(0, 512)).trimStart()
  if (/^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(head)) return 'svg'
  return null
}

export function findSvgProblems(svg: string): string[] {
  const decoded = decodeNumericEntities(svg)
  return SVG_RULES.filter(([pattern]) => pattern.test(decoded)).map(([, problem]) => problem)
}

export function checkLogoFile(bytes: Uint8Array): { type: LogoType } {
  if (bytes.length > MAX_LOGO_BYTES) throw new Error(TOO_LARGE)
  const type = detectLogoType(bytes)
  if (!type) throw new Error(UNSUPPORTED_TYPE)
  if (type === 'svg') {
    const problems = findSvgProblems(decodeText(bytes))
    if (problems.length > 0) throw new Error(`The SVG is not safe to use: ${problems.join(', ')}.`)
  }
  return { type }
}
