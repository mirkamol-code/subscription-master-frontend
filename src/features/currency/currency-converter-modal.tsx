import { useState } from 'react'
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ArrowDownUp } from 'lucide-react'
import { Select } from '@/components/ui/input'
import { useCurrency } from '@/features/currency/currency-context'
import { CURRENCY_META } from '@/lib/labels'
import { formatMoney } from '@/lib/utils'
import { currencies, type Currency } from '@/types/api'

interface CurrencyConverterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CurrencySelect({
  value,
  onChange,
  label,
}: {
  value: Currency
  onChange: (currency: Currency) => void
  label: string
}) {
  return (
    <Select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as Currency)}
      wrapperClassName="w-28 shrink-0"
      className="h-10 bg-fg/[0.03] font-medium"
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {CURRENCY_META[currency].flag} {currency}
        </option>
      ))}
    </Select>
  )
}

export function CurrencyConverterModal({ open, onOpenChange }: CurrencyConverterModalProps) {
  const { convert, lastUpdated, isLive } = useCurrency()
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD')
  const [toCurrency, setToCurrency] = useState<Currency>('UZS')
  const [amountInput, setAmountInput] = useState('10')

  const amount = Math.max(Number(amountInput) || 0, 0)
  const result = convert(amount, fromCurrency, toCurrency)

  const swap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle>Currency converter</DialogTitle>
            <DialogDescription className="mt-0.5">
              {isLive ? `Rates updated ${lastUpdated}` : 'Approximate rates — live rates unavailable'}
            </DialogDescription>
          </div>
          <DialogCloseButton />
        </div>

        <div className="relative mt-6 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-border p-3 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
            <input
              aria-label="Amount"
              type="number"
              inputMode="decimal"
              min="0"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              placeholder="0"
              className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tabular-nums text-fg outline-none placeholder:text-muted/50"
            />
            <CurrencySelect label="From currency" value={fromCurrency} onChange={setFromCurrency} />
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Swap currencies"
            className="absolute left-1/2 top-1/2 z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-muted shadow-sm transition hover:rotate-180 hover:text-accent"
          >
            <ArrowDownUp className="size-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-fg/[0.03] p-3">
            <output className="min-w-0 flex-1 truncate text-2xl font-semibold tabular-nums text-fg">
              {formatMoney(result, toCurrency)}
            </output>
            <CurrencySelect label="To currency" value={toCurrency} onChange={setToCurrency} />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          1 {fromCurrency} = {formatMoney(convert(1, fromCurrency, toCurrency), toCurrency)}
        </p>
      </DialogContent>
    </Dialog>
  )
}
