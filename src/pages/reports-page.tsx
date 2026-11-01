import { useState, type ComponentType } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import {
  downloadAnnualReport,
  ExchangeRatesUnavailableError,
  type ReportFormat,
} from '@/features/reports/annual-report'
import { PageHeader } from '@/components/common/page-header'
import { cn } from '@/lib/utils'

interface ReportOption {
  format: ReportFormat
  title: string
  description: string
  worksWith: string
  icon: ComponentType<{ className?: string }>
  iconClass: string
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    format: 'xlsx',
    title: 'Excel spreadsheet',
    description: 'Every subscription with its price, billing cycle, yearly cost and next payment date.',
    worksWith: 'Excel, Numbers, Google Sheets',
    icon: FileSpreadsheet,
    iconClass: 'bg-success/10 text-success',
  },
  {
    format: 'csv',
    title: 'CSV file',
    description: 'The same details as a simple text file you can open or import almost anywhere.',
    worksWith: 'Budgeting apps, any spreadsheet',
    icon: FileText,
    iconClass: 'bg-accent/10 text-accent',
  },
]

const INCLUDED = ['Service name & category', 'Status & billing cycle', 'Price & yearly cost', 'Start & next payment dates']

export function ReportsPage() {
  const [downloading, setDownloading] = useState<ReportFormat | null>(null)

  const download = async (format: ReportFormat) => {
    setDownloading(format)
    try {
      await downloadAnnualReport(format)
      toast.success('Your report is downloading')
    } catch (error) {
      toast.error(error instanceof ExchangeRatesUnavailableError ? error.message : getApiError(error))
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Download a yearly summary of your subscriptions to keep, share or budget with."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {REPORT_OPTIONS.map((option) => {
          const Icon = option.icon
          const isBusy = downloading === option.format
          return (
            <button
              key={option.format}
              type="button"
              onClick={() => void download(option.format)}
              disabled={downloading !== null}
              aria-busy={isBusy}
              className={cn(
                'group flex flex-col rounded-2xl border border-border bg-surface p-6 text-left outline-none transition-all duration-200',
                'hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-lg hover:shadow-black/5 focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:translate-y-0 disabled:cursor-wait disabled:shadow-none',
                downloading !== null && !isBusy && 'opacity-60',
              )}
            >
                <span className="flex w-full items-start justify-between">
                  <span className={cn('grid size-12 place-items-center rounded-2xl', option.iconClass)}>
                    <Icon className="size-6" />
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-fg/[0.06] text-muted transition-colors group-hover:bg-fg group-hover:text-background">
                    {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  </span>
                </span>
                <span className="mt-5 text-lg font-semibold text-fg">{option.title}</span>
                <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{option.description}</span>
                <span className="mt-5 text-[13px] text-muted">
                  {isBusy ? 'Preparing your file…' : `Works with ${option.worksWith}`}
                </span>
            </button>
          )
        })}
      </div>

      <section>
        <h2 className="text-sm font-medium text-fg">What’s included</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {INCLUDED.map((item) => (
            <li key={item} className="rounded-full bg-surface px-3 py-1.5 text-[13px] text-muted ring-1 ring-border">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-muted">
          Amounts are shown in each subscription’s own currency, with a yearly total in Uzbek som.
        </p>
      </section>
    </div>
  )
}
