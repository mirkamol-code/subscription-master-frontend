import { humanizeCode } from '@/lib/labels'
import type { Tone } from '@/lib/tone'
import type { BillingEmail } from '@/types/api'

export interface BillingEmailDescription {
  kindLabel: string
  tone: Tone
  title: string
  from: string
  confidenceNote?: string
}

const KIND_LABELS: Partial<Record<BillingEmail['kind'], { kindLabel: string; tone: Tone }>> = {
  RECEIPT: { kindLabel: 'Receipt', tone: 'positive' },
  CANCELLATION: { kindLabel: 'Cancellation', tone: 'neutral' },
  PAYMENT_FAILED: { kindLabel: 'Payment failed', tone: 'danger' },
}

export function describeBillingEmail(email: BillingEmail): BillingEmailDescription {
  const kind = KIND_LABELS[email.kind] ?? { kindLabel: humanizeCode(email.kind), tone: 'neutral' as const }
  return {
    ...kind,
    title: email.subject?.trim() || '(no subject)',
    from: email.sender?.trim() || 'Unknown sender',
    ...(email.confidence === 'LOW' && { confidenceNote: 'We’re not sure this email belongs here' }),
  }
}
