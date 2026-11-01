import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export interface MagnitudeBar {
  label: string
  value: number
  summary: string
}

interface MagnitudeBarChartProps {
  bars: MagnitudeBar[]
  ariaLabel: string
}

const BAR_SIZE = 14
const ROW_HEIGHT = 32
const AXIS_WIDTH = 104
const MAX_TICK_CHARS = 14
const countFormat = new Intl.NumberFormat('en-US')

function shortenLabel(label: string) {
  return label.length > MAX_TICK_CHARS ? `${label.slice(0, MAX_TICK_CHARS - 1)}…` : label
}

function BarTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  const bar: MagnitudeBar | undefined = payload?.[0]?.payload
  if (!active || !bar) return null
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-[13px] shadow-lg">
      <p className="font-semibold text-fg">{bar.label}</p>
      <p className="text-muted">{bar.summary}</p>
    </div>
  )
}

export function MagnitudeBarChart({ bars, ariaLabel }: MagnitudeBarChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} style={{ height: bars.length * ROW_HEIGHT + 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bars} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickFormatter={shortenLabel}
            tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
          />
          <Tooltip cursor={{ fill: 'var(--color-fg)', fillOpacity: 0.04 }} content={BarTooltip} />
          <Bar dataKey="value" fill="var(--color-accent)" barSize={BAR_SIZE} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="value"
              position="right"
              fill="var(--color-fg)"
              fontSize={12}
              formatter={(value) => (typeof value === 'number' ? countFormat.format(value) : value)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
