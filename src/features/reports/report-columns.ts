export type ReportColumnKey =
  | 'SERVICE'
  | 'CATEGORY'
  | 'STATUS'
  | 'BILLING'
  | 'PRICE'
  | 'CURRENCY'
  | 'YEARLY_COST'
  | 'YEARLY_COST_UZS'
  | 'STARTED'
  | 'NEXT_PAYMENT'

export interface ReportColumn {
  key: ReportColumnKey
  label: string
}

export const REPORT_COLUMNS: readonly ReportColumn[] = [
  { key: 'SERVICE', label: 'Service' },
  { key: 'CATEGORY', label: 'Category' },
  { key: 'STATUS', label: 'Status' },
  { key: 'BILLING', label: 'Billing' },
  { key: 'PRICE', label: 'Price' },
  { key: 'CURRENCY', label: 'Currency' },
  { key: 'YEARLY_COST', label: 'Yearly cost' },
  { key: 'YEARLY_COST_UZS', label: 'Yearly cost (UZS)' },
  { key: 'STARTED', label: 'Started' },
  { key: 'NEXT_PAYMENT', label: 'Next payment' },
]

export function selectAllReportColumns(): ReportColumnKey[] {
  return REPORT_COLUMNS.map((column) => column.key)
}

export function toggleReportColumn(selected: readonly ReportColumnKey[], key: ReportColumnKey): ReportColumnKey[] {
  return selected.includes(key) ? selected.filter((column) => column !== key) : [...selected, key]
}

export function canDownloadReport(selected: readonly ReportColumnKey[]): boolean {
  return selected.length > 0
}

export function toReportColumnsParam(selected: readonly ReportColumnKey[]): string {
  return REPORT_COLUMNS.filter((column) => selected.includes(column.key))
    .map((column) => column.key)
    .join(',')
}
