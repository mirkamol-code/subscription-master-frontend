import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowDownUp, X } from 'lucide-react'
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
      className="h-10 bg-slate-50 font-medium"
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
          <div className="animate-pop-in">
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="text-lg font-semibold text-slate-900">
                  Currency converter
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-sm text-slate-500">
                  {isLive ? `Rates updated ${lastUpdated}` : 'Approximate rates — live rates unavailable'}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>

            <div className="relative mt-6 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                <input
                  aria-label="Amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tabular-nums text-slate-900 outline-none placeholder:text-slate-300"
                />
                <CurrencySelect label="From currency" value={fromCurrency} onChange={setFromCurrency} />
              </div>

              <button
                type="button"
                onClick={swap}
                aria-label="Swap currencies"
                className="absolute left-1/2 top-1/2 z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:rotate-180 hover:text-teal-600"
              >
                <ArrowDownUp className="size-4" />
              </button>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <output className="min-w-0 flex-1 truncate text-2xl font-semibold tabular-nums text-slate-900">
                  {formatMoney(result, toCurrency)}
                </output>
                <CurrencySelect label="To currency" value={toCurrency} onChange={setToCurrency} />
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              1 {fromCurrency} = {formatMoney(convert(1, fromCurrency, toCurrency), toCurrency)}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
