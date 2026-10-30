import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Paperclip } from 'lucide-react'
import { getApiError } from '@/api/client'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { describeBillingEmail } from '@/features/emails/billing-email-description'
import { downloadAttachment } from '@/features/emails/download-attachment'
import { EmailViewerDialog } from '@/features/emails/email-viewer-dialog'
import { useBillingEmails } from '@/features/emails/use-billing-emails'
import { formatFileSize } from '@/lib/file-size'
import type { Tone } from '@/lib/tone'
import { cn, formatDate, toLocalIsoDate } from '@/lib/utils'
import type { BillingEmail, BillingEmailAttachment } from '@/types/api'

const TONE_BADGE: Record<Tone, string> = {
  positive: 'bg-emerald-50 text-emerald-700',
  neutral: 'bg-slate-100 text-slate-600',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
}

async function saveAttachment(email: BillingEmail, attachment: BillingEmailAttachment) {
  try {
    await downloadAttachment(email.id, attachment)
  } catch (error) {
    toast.error(getApiError(error))
  }
}

export function BillingEmailsCard({ subscriptionId }: { subscriptionId: number }) {
  const emails = useBillingEmails(subscriptionId)
  const [openEmail, setOpenEmail] = useState<BillingEmail | null>(null)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Billing emails</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        {emails.isLoading ? (
          <div className="space-y-2 px-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : emails.isError ? (
          <ErrorState bare error={emails.error} onRetry={() => void emails.refetch()} />
        ) : !emails.data?.length ? (
          <EmptyState
            icon={Mail}
            title="No billing emails yet"
            description="Receipts, cancellations and failed payments we find in Gmail will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {emails.data.map((email) => {
              const description = describeBillingEmail(email)
              return (
                <li key={email.id} className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenEmail(email)}
                    className="flex w-full items-start gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                  >
                    <Badge className={cn('shrink-0', TONE_BADGE[description.tone])}>{description.kindLabel}</Badge>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900 hover:text-teal-700">
                        {description.title}
                      </span>
                      <span className="block truncate text-xs text-slate-400">{description.from}</span>
                      {description.confidenceNote && (
                        <span className="block text-xs text-amber-700">{description.confidenceNote}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">{formatDate(toLocalIsoDate(email.receivedAt))}</span>
                  </button>
                  {email.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 pl-1">
                      {email.attachments.map((attachment) => (
                        <button
                          key={attachment.id}
                          type="button"
                          onClick={() => void saveAttachment(email, attachment)}
                          className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <Paperclip className="size-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{attachment.filename}</span>
                          <span className="shrink-0 text-slate-400">{formatFileSize(attachment.sizeBytes)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
      <EmailViewerDialog email={openEmail} onClose={() => setOpenEmail(null)} />
    </Card>
  )
}
