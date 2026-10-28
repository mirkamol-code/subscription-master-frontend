import { fetchLiveExchangeRates, toUzs, type ExchangeRates } from '@/hooks/use-currency-rates'
import { fetchAllSubscriptions } from '@/hooks/use-subscriptions'
import { getCategoryMeta } from '@/lib/category-config'
import { FREQUENCY_LABEL, STATUS_LABEL } from '@/lib/labels'
import { buildCsvBlob, buildXlsxBlob, type SpreadsheetCell } from '@/lib/spreadsheet'
import { getAnnualizedCost, roundMoney } from '@/lib/utils'
import type { Currency, Subscription } from '@/types/api'

export type ReportFormat = 'xlsx' | 'csv'

/** Thrown instead of building a report with made-up offline rates. */
export class ExchangeRatesUnavailableError extends Error {
  constructor() {
    super('Exchange rates are temporarily unavailable, so the report can’t be created right now. Please try again in a few minutes.')
    this.name = 'ExchangeRatesUnavailableError'
  }
}

const REPORT_FILENAME = 'subscriptions-annual-report'

const REPORT_HEADERS = [
  'Service',
  'Category',
  'Status',
  'Billing',
  'Price',
  'Currency',
  'Yearly cost',
  'Yearly cost (UZS)',
  'Started',
  'Next payment',
] as const

function buildReportRows(
  subscriptions: Subscription[],
  rates: Record<Currency, ExchangeRates>,
): SpreadsheetCell[][] {
  return subscriptions.map((sub) => {
    const yearly = getAnnualizedCost(sub.price, sub.frequency)
    return [
      sub.name,
      getCategoryMeta(sub.category).label,
      STATUS_LABEL[sub.status],
      FREQUENCY_LABEL[sub.frequency],
      roundMoney(sub.price),
      sub.currency,
      roundMoney(yearly),
      roundMoney(toUzs(yearly, sub.currency, rates)),
      sub.startDate,
      sub.nextPaymentDate,
    ]
  })
}

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

/**
 * Built in the browser rather than downloaded from the server, so the file keeps the app's
 * readable labels and every subscription. Rates always come live from the server.
 */
export async function downloadAnnualReport(format: ReportFormat) {
  const [subscriptions, { rates, isLive }] = await Promise.all([
    fetchAllSubscriptions(),
    fetchLiveExchangeRates(),
  ])
  if (!isLive) throw new ExchangeRatesUnavailableError()
  const rows = buildReportRows(subscriptions, rates)
  const blob =
    format === 'csv'
      ? buildCsvBlob(REPORT_HEADERS, rows)
      : buildXlsxBlob('Subscriptions', REPORT_HEADERS, rows)
  triggerBlobDownload(blob, `${REPORT_FILENAME}.${format}`)
}
