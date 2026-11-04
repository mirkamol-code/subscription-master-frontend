import { reportsApi, type ReportFormat } from '@/api/endpoints/reports'
import { toReportColumnsParam, type ReportColumnKey } from '@/features/reports/report-columns'

const REPORT_FILENAME = 'subscriptions-annual-report'

function triggerBlobDownload(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}

export async function downloadAnnualReport(format: ReportFormat, columns: readonly ReportColumnKey[]) {
  const blob = await reportsApi.downloadAnnual(format, toReportColumnsParam(columns))
  triggerBlobDownload(blob, `${REPORT_FILENAME}.${format}`)
}
