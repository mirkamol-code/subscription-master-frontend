import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, ShieldCheck } from 'lucide-react'
import type { ElementType } from 'react'
import { toast } from 'sonner'
import { downloadAnnualReport } from '@/api/endpoints/reports'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ReportsPage() {
  const [downloading, setDownloading] = useState<'csv' | 'xlsx' | null>(null)

  const download = async (format: 'csv' | 'xlsx') => {
    setDownloading(format)
    try {
      await downloadAnnualReport(format)
      toast.success(`Annual ${format.toUpperCase()} report downloaded`)
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">Annual reports</h2>
        <p className="mt-1 text-sm text-slate-500">
          Export the annual subscription data prepared for your account.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <ReportCard
          icon={FileSpreadsheet}
          title="Excel workbook"
          description="Download the annual report as an XLSX file for analysis in spreadsheet software."
          label="Download XLSX"
          onClick={() => void download('xlsx')}
          loading={downloading === 'xlsx'}
        />
        <ReportCard
          icon={FileText}
          title="CSV data"
          description="Download a lightweight CSV file for imports, custom analysis, or archival."
          label="Download CSV"
          onClick={() => void download('csv')}
          loading={downloading === 'csv'}
        />
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
        <p>
          Reports are generated securely by the backend and contain data for the authenticated
          account. This page does not fabricate or cache report content.
        </p>
      </div>
    </div>
  )
}

interface ReportCardProps {
  icon: ElementType
  title: string
  description: string
  label: string
  onClick: () => void
  loading: boolean
}

function ReportCard({ icon: Icon, title, description, label, onClick, loading }: ReportCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{description}</p>
        <Button className="mt-6" variant="outline" onClick={onClick} disabled={loading}>
          {loading ? 'Preparing…' : label}
          {!loading && <Download className="size-4" />}
        </Button>
      </CardContent>
    </Card>
  )
}
