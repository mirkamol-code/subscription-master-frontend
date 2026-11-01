import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { describeBillingEmail } from '@/features/emails/billing-email-description'
import { ReceiptAmountForm } from '@/features/emails/receipt-amount-form'
import { formatInstant } from '@/lib/utils'
import type { BillingEmail, Currency } from '@/types/api'

interface ReceiptAmountDialogProps {
  subscriptionId: number
  defaultCurrency: Currency
  receipt: BillingEmail | null
  onClose: () => void
}

export function ReceiptAmountDialog({ subscriptionId, defaultCurrency, receipt, onClose }: ReceiptAmountDialogProps) {
  const description = receipt ? describeBillingEmail(receipt) : null

  return (
    <Dialog open={receipt !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex flex-col gap-4">
        {receipt && description && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle>Enter the amount</DialogTitle>
                <DialogDescription className="mt-1">
                  We found this receipt but couldn’t read its amount. Copy it from the email to record the payment.
                </DialogDescription>
                <p className="mt-2 truncate text-sm text-fg">
                  {description.title} · {formatInstant(receipt.receivedAt)}
                </p>
              </div>
              <DialogCloseButton className="shrink-0" aria-label="Close" />
            </div>
            <ReceiptAmountForm
              key={receipt.id}
              subscriptionId={subscriptionId}
              defaultCurrency={defaultCurrency}
              receipt={receipt}
              onRecorded={onClose}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
