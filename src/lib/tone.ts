export type Tone = 'positive' | 'neutral' | 'warning' | 'danger'

export const TONE_STYLES: Record<Tone, { text: string; dot: string; badge: string }> = {
  positive: { text: 'text-muted', dot: 'bg-success', badge: 'bg-success/10 text-success' },
  neutral: { text: 'text-muted', dot: 'bg-muted', badge: 'bg-fg/[0.06] text-muted' },
  warning: { text: 'text-warning', dot: 'bg-warning', badge: 'bg-warning/10 text-warning' },
  danger: { text: 'text-danger', dot: 'bg-danger', badge: 'bg-danger/10 text-danger' },
}
