import { createHash } from 'node:crypto'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { checkLogoFile } from '../src/lib/brand-file-safety.ts'
import {
  isValidMerchantKey,
  parseBrandRegistry,
  requireApprovedEntry,
  requireHttpsUrl,
  updateBrandEntry,
} from '../src/lib/brand-registry.ts'
import { downloadLogo } from './brand-download.ts'

const BRANDS_DIR = new URL('../src/assets/brands/', import.meta.url)
const REGISTRY = new URL('BRANDS.md', BRANDS_DIR)
const LOCAL_SOURCE_PREFIX = 'local file: '
const LOGO_FILE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:svg|png|webp)$/
const USAGE = 'Usage: npm run brand:add -- <merchant-key> [https-url | local-file]'

function formatIsoDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

async function readSource(key: string, source: string): Promise<{ bytes: Uint8Array; recordedSource: string }> {
  if (source.startsWith(LOCAL_SOURCE_PREFIX))
    throw new Error(`${key}'s logo came from a local file. Pass the file again: npm run brand:add -- ${key} ./path/to/logo.png`)
  if (/^[a-z][a-z0-9+.-]*:/i.test(source)) {
    const url = requireHttpsUrl(source)
    return { bytes: await downloadLogo(url), recordedSource: url.href }
  }
  return { bytes: new Uint8Array(await readFile(source)), recordedSource: LOCAL_SOURCE_PREFIX + path.basename(source) }
}

async function removePreviousFile(previousFile: string, newFile: string) {
  if (!previousFile || previousFile === newFile || !LOGO_FILE_NAME.test(previousFile)) return
  try {
    await unlink(new URL(previousFile, BRANDS_DIR))
  } catch (error) {
    if ((error as { code?: string }).code !== 'ENOENT') throw error
  }
}

async function addBrandLogo(key: string | undefined, sourceArgument: string | undefined) {
  if (!key) throw new Error(USAGE)
  if (!isValidMerchantKey(key)) throw new Error(`"${key}" is not a merchant key. Use the exact lowercase key, e.g. netflix.`)
  const markdown = await readFile(REGISTRY, 'utf8')
  const entry = requireApprovedEntry(parseBrandRegistry(markdown), key)
  const source = sourceArgument ?? entry.source
  if (!source) throw new Error(`No source for ${key}. Put a URL in its BRANDS.md row or pass one. ${USAGE}`)
  const { bytes, recordedSource } = await readSource(key, source)
  const { type } = checkLogoFile(bytes)
  const fileName = `${key}.${type}`
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const updatedRegistry = updateBrandEntry(markdown, key, { file: fileName, source: recordedSource, added: formatIsoDate(new Date()), sha256 })
  await writeFile(new URL(fileName, BRANDS_DIR), bytes)
  await removePreviousFile(entry.file, fileName)
  await writeFile(REGISTRY, updatedRegistry)
  console.log(`Saved src/assets/brands/${fileName} for ${key} (SHA-256 ${sha256}). Commit it with BRANDS.md.`)
}

addBrandLogo(process.argv[2], process.argv[3]).catch((error: unknown) => {
  console.error(`brand:add failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
