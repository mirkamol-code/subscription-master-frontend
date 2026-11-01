import { useState } from 'react'
import { ArrowRightLeft, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrency } from '@/features/currency/currency-context'
import { CurrencyConverterModal } from '@/features/currency/currency-converter-modal'
import { CURRENCY_META } from '@/lib/labels'
import { currencies } from '@/types/api'

export function CurrencySwitcherDropdown() {
  const { displayCurrency, setDisplayCurrency } = useCurrency()
  const [converterOpen, setConverterOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-fg outline-none transition-colors hover:border-fg/20 hover:bg-fg/[0.04] focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-fg/[0.06]"
            aria-label={`Show amounts in ${displayCurrency}. Change currency`}
          >
            <span aria-hidden>{CURRENCY_META[displayCurrency].flag}</span>
            {displayCurrency}
            <ChevronDown className="size-3.5 text-muted" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Show amounts in</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={displayCurrency}
            onValueChange={(value) => {
              const currency = currencies.find((choice) => choice === value)
              if (currency) setDisplayCurrency(currency)
            }}
          >
            {currencies.map((currency) => (
              <DropdownMenuRadioItem key={currency} value={currency}>
                <span aria-hidden>{CURRENCY_META[currency].flag}</span>
                <span className="flex-1">
                  {CURRENCY_META[currency].name}
                  <span className="ml-1.5 text-muted">{currency}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConverterOpen(true)}>
            <ArrowRightLeft />
            Currency converter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CurrencyConverterModal open={converterOpen} onOpenChange={setConverterOpen} />
    </>
  )
}
