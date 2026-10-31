import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
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
    <Dialog.Root open={receipt !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl outline-none">
          {receipt && description && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="text-lg font-semibold text-slate-900">Enter the amount</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">
                    We found this receipt but couldn’t read its amount. Copy it from the email to record the payment.
                  </Dialog.Description>
                  <p className="mt-2 truncate text-sm text-slate-700">
                    {description.title} · {formatInstant(receipt.receivedAt)}
                  </p>
                </div>
                <Dialog.Close
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Dialog.Close>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
