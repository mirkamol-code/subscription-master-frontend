import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ArrowRightLeft, Check, ChevronDown } from 'lucide-react'
import { useCurrency } from '@/features/currency/currency-context'
import { CurrencyConverterModal } from '@/features/currency/currency-converter-modal'
import { CURRENCY_META } from '@/lib/labels'
import { currencies } from '@/types/api'

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none data-highlighted:bg-slate-100'

export function CurrencySwitcherDropdown() {
  const { displayCurrency, setDisplayCurrency } = useCurrency()
  const [converterOpen, setConverterOpen] = useState(false)

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-2xs outline-none transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-teal-500/60"
            aria-label={`Show amounts in ${displayCurrency}. Change currency`}
          >
            <span aria-hidden>{CURRENCY_META[displayCurrency].flag}</span>
            {displayCurrency}
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-pop-in"
          >
            <DropdownMenu.Label className="px-2.5 pb-1 pt-2 text-xs font-medium text-slate-400">
              Show amounts in
            </DropdownMenu.Label>
            {currencies.map((currency) => (
              <DropdownMenu.Item
                key={currency}
                onSelect={() => setDisplayCurrency(currency)}
                className={itemClass}
              >
                <span aria-hidden>{CURRENCY_META[currency].flag}</span>
                <span className="flex-1 text-slate-700">
                  {CURRENCY_META[currency].name}
                  <span className="ml-1.5 text-slate-400">{currency}</span>
                </span>
                {displayCurrency === currency && <Check className="size-4 text-teal-600" />}
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
            <DropdownMenu.Item onSelect={() => setConverterOpen(true)} className={itemClass}>
              <ArrowRightLeft className="size-4 text-slate-400" />
              <span className="text-slate-700">Currency converter</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <CurrencyConverterModal open={converterOpen} onOpenChange={setConverterOpen} />
    </>
  )
}
