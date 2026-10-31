import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { useConfirmReceiptAmount } from '@/features/emails/use-billing-emails'
import { CURRENCY_META } from '@/lib/labels'
import { receiptAmountSchema, type ReceiptAmountValues } from '@/schemas/receipt-amount'
import { currencies, type BillingEmail, type Currency } from '@/types/api'

interface ReceiptAmountFormProps {
  subscriptionId: number
  defaultCurrency: Currency
  receipt: BillingEmail
  onRecorded: () => void
}

export function ReceiptAmountForm({ subscriptionId, defaultCurrency, receipt, onRecorded }: ReceiptAmountFormProps) {
  const [serverError, setServerError] = useState('')
  const amountErrorId = useId()
  const confirmAmount = useConfirmReceiptAmount(subscriptionId)
  const form = useForm<ReceiptAmountValues>({
    resolver: zodResolver(receiptAmountSchema),
    defaultValues: { amount: undefined, currency: defaultCurrency },
  })
  const amountError = form.formState.errors.amount?.message

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError('')
    try {
      await confirmAmount.mutateAsync({ emailId: receipt.id, input: values })
      toast.success('Payment recorded')
      onRecorded()
    } catch (error) {
      setServerError(getApiError(error))
    }
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {serverError}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Amount charged</span>
            <Input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              autoFocus
              aria-required
              aria-invalid={!!amountError}
              aria-describedby={amountError ? amountErrorId : undefined}
              {...form.register('amount', { valueAsNumber: true })}
            />
          </label>
          {amountError && (
            <p id={amountErrorId} className="mt-1.5 text-[13px] text-rose-600">
              {amountError}
            </p>
          )}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Currency</span>
          <Select aria-required {...form.register('currency')}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {CURRENCY_META[currency].flag} {currency}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit" variant="accent" disabled={confirmAmount.isPending}>
          {confirmAmount.isPending ? 'Saving…' : 'Record payment'}
        </Button>
      </div>
    </form>
  )
}
