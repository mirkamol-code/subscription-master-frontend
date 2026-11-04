export type BrandStatus = 'approved' | 'pending' | 'rejected'

export interface BrandEntry {
  key: string
  title: string
  file: string
  status: BrandStatus
  source: string
  added: string
  sha256: string
  tint: string
  guidelines: string
}

type RecordedFields = Pick<BrandEntry, 'file' | 'source' | 'added' | 'sha256'>

const REGISTRY_HEADING = '## Registry'
const EMPTY_CELL = '—'
const COLUMNS: readonly (keyof BrandEntry)[] = ['key', 'title', 'file', 'status', 'source', 'added', 'sha256', 'tint', 'guidelines']
const STATUSES: readonly BrandStatus[] = ['approved', 'pending', 'rejected']
const MERCHANT_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function findRegistryRows(lines: readonly string[]): number[] {
  const start = lines.findIndex((line) => line.trim() === REGISTRY_HEADING)
  if (start < 0) return []
  const rows: number[] = []
  for (let index = start + 1; index < lines.length; index++) {
    const line = lines[index].trim()
    if (line.startsWith('## ')) break
    if (line.startsWith('|') && !/^\|\s*-/.test(line) && !/^\|\s*Key\s*\|/.test(line)) rows.push(index)
  }
  return rows
}

function splitCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
}

function toEntry(line: string): BrandEntry {
  const cells = splitCells(line)
  const values = Object.fromEntries(COLUMNS.map((column, index) => [column, cells[index] === EMPTY_CELL ? '' : (cells[index] ?? '')]))
  const status = STATUSES.find((candidate) => candidate === values.status) ?? 'pending'
  return { ...(values as Omit<BrandEntry, 'status'>), status }
}

function toLine(entry: BrandEntry): string {
  return `| ${COLUMNS.map((column) => entry[column] || EMPTY_CELL).join(' | ')} |`
}

export function parseBrandRegistry(markdown: string): BrandEntry[] {
  const lines = markdown.split('\n')
  return findRegistryRows(lines).map((index) => toEntry(lines[index]))
}

export function updateBrandEntry(markdown: string, key: string, changes: RecordedFields): string {
  const lines = markdown.split('\n')
  const row = findRegistryRows(lines).find((index) => toEntry(lines[index]).key === key)
  if (row === undefined) throw new Error(`${key} has no row in BRANDS.md. Add one and mark it "approved" first.`)
  lines[row] = toLine({ ...toEntry(lines[row]), ...changes })
  return lines.join('\n')
}

export function requireApprovedEntry(entries: readonly BrandEntry[], key: string): BrandEntry {
  const entry = entries.find((candidate) => candidate.key === key)
  if (!entry) throw new Error(`${key} has no row in BRANDS.md. Add one and mark it "approved" first.`)
  if (entry.status !== 'approved')
    throw new Error(`${key} is "${entry.status}" in BRANDS.md. Mark it "approved" after checking its trademark guidelines.`)
  return entry
}

export function isValidMerchantKey(key: string): boolean {
  return MERCHANT_KEY.test(key)
}

export function requireHttpsUrl(source: string): URL {
  let url: URL
  try {
    url = new URL(source)
  } catch {
    throw new Error('Logo URLs must use https://')
  }
  if (url.protocol !== 'https:') throw new Error('Logo URLs must use https://')
  return url
}
