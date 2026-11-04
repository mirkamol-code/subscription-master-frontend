import registryMarkdown from '@/assets/brands/BRANDS.md?raw'
import { parseBrandRegistry, type BrandEntry } from '@/lib/brand-registry'

export interface BrandLogo {
  src: string
  title: string
  tint: string | null
}

const THEME_TINT = 'theme'

const BUNDLED_FILES = import.meta.glob('@/assets/brands/*.{svg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function indexByFileName(files: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]))
}

function resolveTint(tint: string): string | null {
  if (!tint) return null
  return tint === THEME_TINT ? 'currentColor' : tint
}

export function buildBrandLogos(entries: readonly BrandEntry[], urlsByFile: Record<string, string>): Map<string, BrandLogo> {
  const logos = new Map<string, BrandLogo>()
  const keys = entries.map((entry) => entry.key)
  for (const entry of entries) {
    if (keys.indexOf(entry.key) !== keys.lastIndexOf(entry.key)) continue
    const src = entry.file ? urlsByFile[entry.file] : undefined
    if (entry.status === 'approved' && src) logos.set(entry.key, { src, title: entry.title, tint: resolveTint(entry.tint) })
  }
  return logos
}

const LOGOS = buildBrandLogos(parseBrandRegistry(registryMarkdown), indexByFileName(BUNDLED_FILES))

export function getBrandLogo(merchantKey: string | null | undefined): BrandLogo | null {
  return (merchantKey && LOGOS.get(merchantKey)) || null
}
