export const MAX_LOGO_BYTES = 256 * 1024

export type LogoType = 'svg' | 'png' | 'webp'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

const SVG_RULES: readonly (readonly [RegExp, string])[] = [
  [/<script\b/i, 'scripts'],
  [/\son[a-z]+\s*=/i, 'event handlers'],
  [/javascript:/i, 'javascript: links'],
  [/\b(?:xlink:)?href\s*=\s*["']\s*(?!#)/i, 'external links'],
  [/<(?:foreignObject|iframe|embed|object|audio|video|canvas)\b/i, 'embedded content'],
  [/<image\b/i, 'embedded images'],
  [/url\s*\(|@import/i, 'CSS url() or @import'],
  [/data:/i, 'data: content'],
  [/<!DOCTYPE|<!ENTITY/i, 'doctype or entities'],
]

function startsWithBytes(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  return signature.every((byte, index) => bytes[offset + index] === byte)
}

function asText(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

export function detectLogoType(bytes: Uint8Array): LogoType | null {
  if (startsWithBytes(bytes, PNG_SIGNATURE)) return 'png'
  const ascii = (offset: number, text: string) => startsWithBytes(bytes, [...text].map((char) => char.charCodeAt(0)), offset)
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'webp'
  const head = asText(bytes.subarray(0, 512)).trimStart()
  if (/^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(head)) return 'svg'
  return null
}

export function findSvgProblems(svg: string): string[] {
  return SVG_RULES.filter(([pattern]) => pattern.test(svg)).map(([, problem]) => problem)
}

export function checkLogoFile(bytes: Uint8Array): { type: LogoType } {
  if (bytes.length > MAX_LOGO_BYTES) throw new Error('The logo is larger than 256 KB.')
  const type = detectLogoType(bytes)
  if (!type) throw new Error('Only SVG, PNG or WebP logos are allowed.')
  if (type === 'svg') {
    const problems = findSvgProblems(asText(bytes))
    if (problems.length > 0) throw new Error(`The SVG is not safe to use: ${problems.join(', ')}.`)
  }
  return { type }
}
