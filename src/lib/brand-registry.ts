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
  notes: string
}

type RecordedFields = Pick<BrandEntry, 'file' | 'source' | 'added' | 'sha256'>

const REGISTRY_HEADING = '## Registry'
const EMPTY_CELL = '—'
const COLUMNS: readonly (keyof BrandEntry)[] = ['key', 'title', 'file', 'status', 'source', 'added', 'sha256', 'tint', 'guidelines', 'notes']
const HTTPS_REQUIRED = 'Logo URLs must use https://'
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

function parseRow(line: string): BrandEntry {
  const cells = splitCells(line)
  const values = Object.fromEntries(COLUMNS.map((column, index) => [column, cells[index] === EMPTY_CELL ? '' : (cells[index] ?? '')]))
  const isWellFormed = cells.length === COLUMNS.length
  const status = (isWellFormed && STATUSES.find((candidate) => candidate === values.status)) || 'pending'
  return { ...(values as Omit<BrandEntry, 'status'>), status }
}

function formatRow(entry: BrandEntry): string {
  return `| ${COLUMNS.map((column) => entry[column] || EMPTY_CELL).join(' | ')} |`
}

export function parseBrandRegistry(markdown: string): BrandEntry[] {
  const lines = markdown.split('\n')
  return findRegistryRows(lines).map((index) => parseRow(lines[index]))
}

function describeMissingRow(key: string): string {
  return `${key} has no row in BRANDS.md. Add one and mark it "approved" first.`
}

export function findRegistryProblems(markdown: string): string[] {
  const lines = markdown.split('\n')
  const rows = findRegistryRows(lines)
  const keys = rows.map((index) => parseRow(lines[index]).key)
  const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))]
  const malformed = rows
    .map((index) => [parseRow(lines[index]).key, splitCells(lines[index]).length] as const)
    .filter(([, cells]) => cells !== COLUMNS.length)
  return [
    ...duplicates.map((key) => `${key} appears more than once in BRANDS.md.`),
    ...malformed.map(([key, cells]) => `The ${key} row has ${cells} cells instead of ${COLUMNS.length}. A "|" is not allowed inside a cell.`),
  ]
}

export function updateBrandEntry(markdown: string, key: string, changes: RecordedFields): string {
  const problems = findRegistryProblems(markdown)
  if (problems.length > 0) throw new Error(problems.join(' '))
  const lines = markdown.split('\n')
  const row = findRegistryRows(lines).find((index) => parseRow(lines[index]).key === key)
  if (row === undefined) throw new Error(describeMissingRow(key))
  lines[row] = formatRow({ ...parseRow(lines[row]), ...changes })
  return lines.join('\n')
}

export function requireApprovedEntry(entries: readonly BrandEntry[], key: string): BrandEntry {
  const matches = entries.filter((candidate) => candidate.key === key)
  if (matches.length > 1) throw new Error(`${key} appears more than once in BRANDS.md.`)
  const entry = matches[0]
  if (!entry) throw new Error(describeMissingRow(key))
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
    throw new Error(HTTPS_REQUIRED)
  }
  if (url.protocol !== 'https:') throw new Error(HTTPS_REQUIRED)
  return url
}
