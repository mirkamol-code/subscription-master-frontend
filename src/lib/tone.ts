export type Tone = 'positive' | 'neutral' | 'warning' | 'danger'

export const TONE_STYLES: Record<Tone, { text: string; dot: string; badge: string }> = {
  positive: { text: 'text-slate-500', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  neutral: { text: 'text-slate-500', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
  warning: { text: 'text-amber-700', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  danger: { text: 'text-rose-600', dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700' },
}
