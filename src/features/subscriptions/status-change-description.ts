import { getStatusLabel } from '@/lib/labels'
import type { Tone } from '@/lib/tone'
import { formatShortDate, toLocalIsoDate } from '@/lib/utils'
import type { StatusChange, Subscription } from '@/types/api'

export interface StatusChangeDescription {
  text: string
  detail?: string
  tone: Tone
}

type DescribedSubscription = Pick<Subscription, 'name'>

function describeSourceEmail(change: StatusChange): string | undefined {
  const sender = change.emailSender?.trim()
  const subject = change.emailSubject?.trim()
  if (subject && sender) return `“${subject}” from ${sender}`
  if (subject) return `“${subject}”`
  return sender ? `Email from ${sender}` : undefined
}

function describeOverdue(change: StatusChange, name: string): StatusChangeDescription {
  const expected = formatShortDate(toLocalIsoDate(change.effectiveAt))
  return { text: `We didn’t find a receipt for ${name}, expected ${expected}. Check your payment`, tone: 'warning' }
}

export function describeStatusChange(
  change: StatusChange,
  subscription: DescribedSubscription,
): StatusChangeDescription {
  const { name } = subscription
  const detail = describeSourceEmail(change)
  switch (change.reason) {
    case 'EMAIL_RECEIPT':
      return { text: `Receipt found, ${name} is active`, detail, tone: 'positive' }
    case 'EMAIL_CANCELLATION': {
      const accessEnds = change.endsOn ? `. Access ends ${formatShortDate(change.endsOn)}` : ''
      return { text: `${name} was cancelled${accessEnds}`, detail, tone: 'neutral' }
    }
    case 'CANCELLATION_SCHEDULED': {
      const endDate = change.endsOn ? ` on ${formatShortDate(change.endsOn)}` : ''
      return { text: `${name} is set to end${endDate}`, detail, tone: 'neutral' }
    }
    case 'EMAIL_PAYMENT_FAILED':
      return { text: `${name} payment failed`, detail, tone: 'danger' }
    case 'OVERDUE':
      return describeOverdue(change, name)
    case 'SCHEDULED_END':
      return { text: `${name} ended as scheduled`, tone: 'neutral' }
    case 'USER':
      return { text: `You marked ${name} as ${getStatusLabel(change.toStatus)}`, tone: 'neutral' }
    default:
      return { text: `${name} changed to ${getStatusLabel(change.toStatus)}`, tone: 'neutral' }
  }
}
