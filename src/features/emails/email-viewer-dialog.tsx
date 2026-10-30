import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ImageIcon, X } from 'lucide-react'
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
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
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
        className="h-[60vh] w-full rounded-xl border border-slate-200 bg-white"
      />
    </div>
  )
}

export function EmailViewerDialog({ email, onClose }: EmailViewerDialogProps) {
  const description = email ? describeBillingEmail(email) : null

  return (
    <Dialog.Root open={email !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl outline-none">
          {email && description && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="truncate text-lg font-semibold text-slate-900">{description.title}</Dialog.Title>
                  <Dialog.Description className="truncate text-sm text-slate-500">
                    {description.from} · {formatInstant(email.receivedAt)}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close email"
                >
                  <X className="size-4" />
                </Dialog.Close>
              </div>
              <EmailBody key={email.id} email={email} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
