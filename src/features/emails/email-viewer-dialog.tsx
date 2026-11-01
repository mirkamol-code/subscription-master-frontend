import { useState } from 'react'
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ImageIcon} from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { describeBillingEmail } from '@/features/emails/billing-email-description'
import { buildEmailDocument } from '@/features/emails/email-document'
import { useEmailContent } from '@/features/emails/use-billing-emails'
import { formatInstant } from '@/lib/utils'
import type { BillingEmail } from '@/types/api'

interface EmailViewerDialogProps {
  email: BillingEmail | null
  onClose: () => void
}

function EmailBody({ email }: { email: BillingEmail }) {
  const [isShowingImages, setIsShowingImages] = useState(false)
  const content = useEmailContent(email.id, isShowingImages)

  if (content.isLoading) return <Skeleton className="h-96 rounded-xl" />
  if (!content.data) return <ErrorState bare error={content.error} onRetry={() => void content.refetch()} />

  const blocked = content.data.blockedRemoteImages
  return (
    <div className="space-y-3">
      {blocked > 0 && !isShowingImages && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-fg/[0.03] px-4 py-2.5 text-sm text-muted">
          <span>
            {blocked} remote {blocked === 1 ? 'image was' : 'images were'} blocked to protect your privacy.
          </span>
          <Button size="sm" variant="outline" onClick={() => setIsShowingImages(true)}>
            <ImageIcon className="size-4" aria-hidden /> Load images
          </Button>
        </div>
      )}
      <iframe
        title={`Email: ${describeBillingEmail(email).title}`}
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        srcDoc={buildEmailDocument(content.data.html, content.data.contentSecurityPolicy)}
        className="h-[60vh] w-full rounded-xl border border-border bg-surface"
      />
    </div>
  )
}

export function EmailViewerDialog({ email, onClose }: EmailViewerDialogProps) {
  const description = email ? describeBillingEmail(email) : null

  return (
    <Dialog open={email !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-4 overflow-y-auto">
        {email && description && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="truncate">{description.title}</DialogTitle>
                <DialogDescription className="truncate mt-0">
                  {description.from} · {formatInstant(email.receivedAt)}
                </DialogDescription>
              </div>
              <DialogCloseButton className="shrink-0" aria-label="Close email" />
            </div>
            <EmailBody key={email.id} email={email} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
