import { createHash } from 'node:crypto'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { checkLogoFile, MAX_LOGO_BYTES } from '../src/lib/brand-file-safety.ts'
import {
  isValidMerchantKey,
  parseBrandRegistry,
  requireApprovedEntry,
  requireHttpsUrl,
  updateBrandEntry,
} from '../src/lib/brand-registry.ts'

const BRANDS_DIR = new URL('../src/assets/brands/', import.meta.url)
const REGISTRY = new URL('BRANDS.md', BRANDS_DIR)
const ALLOWED_CONTENT_TYPES = ['image/svg+xml', 'image/png', 'image/webp']
const USAGE = 'Usage: npm run brand:add -- <merchant-key> [https-url | local-file]'

async function download(url: URL): Promise<Uint8Array> {
  const response = await fetch(url, { redirect: 'follow' })
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`)
  if (new URL(response.url).protocol !== 'https:') throw new Error('Logo URLs must use https://, including redirects.')
  const contentType = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (!ALLOWED_CONTENT_TYPES.includes(contentType))
    throw new Error(`The URL returned "${contentType || 'no content type'}"; only SVG, PNG or WebP logos are allowed.`)
  if (Number(response.headers.get('content-length') ?? 0) > MAX_LOGO_BYTES) throw new Error('The logo is larger than 256 KB.')
  return new Uint8Array(await response.arrayBuffer())
}

async function readSource(source: string): Promise<{ bytes: Uint8Array; recordedSource: string }> {
  if (/^[a-z][a-z0-9+.-]*:/i.test(source)) {
    const url = requireHttpsUrl(source)
    return { bytes: await download(url), recordedSource: url.href }
  }
  return { bytes: new Uint8Array(await readFile(source)), recordedSource: `local file: ${path.basename(source)}` }
}

async function addBrandLogo(key: string | undefined, sourceArgument: string | undefined) {
  if (!key) throw new Error(USAGE)
  if (!isValidMerchantKey(key)) throw new Error(`"${key}" is not a merchant key. Use the exact lowercase key, e.g. netflix.`)
  const markdown = await readFile(REGISTRY, 'utf8')
  const entry = requireApprovedEntry(parseBrandRegistry(markdown), key)
  const source = sourceArgument ?? entry.source
  if (!source) throw new Error(`No source for ${key}. Put a URL in its BRANDS.md row or pass one. ${USAGE}`)
  const { bytes, recordedSource } = await readSource(source)
  const { type } = checkLogoFile(bytes)
  const fileName = `${key}.${type}`
  await writeFile(new URL(fileName, BRANDS_DIR), bytes)
  if (entry.file && entry.file !== fileName) await unlink(new URL(entry.file, BRANDS_DIR)).catch(() => undefined)
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const added = new Date().toLocaleDateString('en-CA')
  await writeFile(REGISTRY, updateBrandEntry(markdown, key, { file: fileName, source: recordedSource, added, sha256 }))
  console.log(`Saved src/assets/brands/${fileName} for ${key} (SHA-256 ${sha256}). Commit it with BRANDS.md.`)
}

addBrandLogo(process.argv[2], process.argv[3]).catch((error: unknown) => {
  console.error(`brand:add failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
