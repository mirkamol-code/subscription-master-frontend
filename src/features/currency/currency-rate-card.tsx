import { RotateCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useCurrency } from '@/features/currency/currency-context'
import { CURRENCY_META } from '@/lib/labels'
import { cn, formatMoney } from '@/lib/utils'
import type { Currency } from '@/types/api'

const QUOTED: Currency[] = ['USD', 'EUR']

export function CurrencyRateCard() {
  const { rates, lastUpdated, isLive, refreshRates, isRefetching } = useCurrency()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">Exchange rates</h2>
        <button
          type="button"
          onClick={refreshRates}
          disabled={isRefetching}
          className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          aria-label="Refresh exchange rates"
        >
          <RotateCw className={cn('size-3.5', isRefetching && 'animate-spin')} />
        </button>
      </div>

      <dl className="mt-4 space-y-3">
        {QUOTED.map((currency) => (
          <div key={currency} className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-sm text-slate-500">
              <span aria-hidden>{CURRENCY_META[currency].flag}</span>1 {currency}
            </dt>
            <dd className="text-sm font-semibold tabular-nums text-slate-900">
              {formatMoney(rates[currency].UZS, 'UZS')}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <span className={cn('size-1.5 rounded-full', isLive ? 'bg-emerald-500' : 'bg-slate-300')} />
        {isLive ? `Updated ${lastUpdated}` : 'Approximate rates — live rates unavailable'}
      </p>
    </Card>
  )
}
