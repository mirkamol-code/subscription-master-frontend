import { useState } from 'react'
import { History, Mail } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmailViewerDialog } from '@/features/emails/email-viewer-dialog'
import { OpenInGmailLink } from '@/features/emails/open-in-gmail-link'
import { useBillingEmails } from '@/features/emails/use-billing-emails'
import { describeStatusChange } from '@/features/subscriptions/status-change-description'
import { useStatusHistory } from '@/hooks/use-subscriptions'
import { TONE_STYLES } from '@/lib/tone'
import { cn, formatInstant } from '@/lib/utils'
import type { BillingEmail, StatusChange, Subscription } from '@/types/api'

interface StatusHistoryCardProps {
  subscription: Subscription
}

interface SourceEmailLinksProps {
  change: StatusChange
  sourceEmail: BillingEmail | undefined
  onView: (email: BillingEmail) => void
}

function SourceEmailLinks({ change, sourceEmail, onView }: SourceEmailLinksProps) {
  if (!sourceEmail && !change.gmailMessageId) return null
  return (
    <span className="mt-1 flex flex-wrap gap-3 text-xs">
      {sourceEmail && (
        <button
          type="button"
          onClick={() => onView(sourceEmail)}
          className="inline-flex items-center gap-1 text-teal-700 hover:underline"
        >
          <Mail className="size-3.5" aria-hidden /> View email
        </button>
      )}
      {change.gmailMessageId && (
        <OpenInGmailLink gmailMessageId={change.gmailMessageId} className="gap-1 text-slate-500 hover:underline" />
      )}
    </span>
  )
}

export function StatusHistoryCard({ subscription }: StatusHistoryCardProps) {
  const history = useStatusHistory(subscription.id)
  const emails = useBillingEmails(subscription.id)
  const [openEmail, setOpenEmail] = useState<BillingEmail | null>(null)
  const findSourceEmail = (change: StatusChange) => emails.data?.find((email) => email.id === change.billingEmailId)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Status history</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        {history.isLoading ? (
          <div className="space-y-2 px-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : history.isError ? (
          <ErrorState bare error={history.error} onRetry={() => void history.refetch()} />
        ) : !history.data?.length ? (
          <EmptyState
            icon={History}
            title="No status changes yet"
            description="Receipts, cancellations and failed payments will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.data.map((change) => {
              const description = describeStatusChange(change, subscription)
              return (
                <li key={change.id} className="flex items-start gap-3 px-3 py-3">
                  <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', TONE_STYLES[description.tone].dot)} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-slate-700">{description.text}</span>
                    {description.detail && (
                      <span className="block truncate text-xs text-slate-400">{description.detail}</span>
                    )}
                    <SourceEmailLinks change={change} sourceEmail={findSourceEmail(change)} onView={setOpenEmail} />
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{formatInstant(change.effectiveAt)}</span>
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
