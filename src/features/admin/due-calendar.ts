import type { DueBucket, PaymentDue, VisibleRange } from '@/features/admin/types'
import { formatMoney } from '@/lib/utils'

export type DueTone = 'overdue' | 'passed' | 'today' | 'soon' | 'week' | 'later' | 'access'

const TONE_BY_BUCKET: Record<DueBucket, DueTone> = {
  OVERDUE: 'overdue',
  PASSED: 'passed',
  TODAY: 'today',
  NEXT_3_DAYS: 'soon',
  NEXT_7_DAYS: 'week',
  LATER: 'later',
}

export const DUE_TONES: DueTone[] = ['overdue', 'today', 'soon', 'week', 'access', 'passed', 'later']

export const DUE_TONE_LABEL: Record<DueTone, string> = {
  overdue: 'Overdue (billing required)',
  passed: 'Awaiting receipt',
  today: 'Due today',
  soon: 'Due in 3 days',
  week: 'Due in 7 days',
  later: 'Later',
  access: 'Access ending',
}

const DUE_TONE_SHORT_LABEL: Record<DueTone, string> = {
  overdue: 'Overdue',
  passed: 'Awaiting',
  today: 'Today',
  soon: '≤3d',
  week: '≤7d',
  later: 'Later',
  access: 'Ends',
}

const DAY_MS = 24 * 60 * 60 * 1000

export interface DueCalendarEvent {
  id: string
  title: string
  start: string
  allDay: true
  classNames: string[]
  extendedProps: { userId: number; toneLabel: string; shortLabel: string }
}

export function getDueTone(entry: PaymentDue): DueTone {
  return entry.kind === 'ACCESS_END' ? 'access' : TONE_BY_BUCKET[entry.bucket]
}

export function getDueToneClass(tone: DueTone) {
  return `due-${tone}`
}

export function getDueEntryKey(entry: PaymentDue) {
  return `${entry.subscriptionId}:${entry.kind}`
}

export function describeDueAmount(entry: PaymentDue) {
  return entry.amount === null ? 'access ends' : formatMoney(entry.amount, entry.currency)
}

export function describeDueUser(entry: PaymentDue) {
  return entry.userName === entry.userEmail ? entry.userEmail : `${entry.userName} (${entry.userEmail})`
}

export function toCalendarEvents(entries: PaymentDue[]): DueCalendarEvent[] {
  return entries.map((entry) => {
    const tone = getDueTone(entry)
    return {
      id: getDueEntryKey(entry),
      title: `${entry.merchant} · ${describeDueAmount(entry)} · ${describeDueUser(entry)}`,
      start: entry.dueDate,
      allDay: true,
      classNames: ['due-event', getDueToneClass(tone)],
      extendedProps: { userId: entry.userId, toneLabel: DUE_TONE_LABEL[tone], shortLabel: DUE_TONE_SHORT_LABEL[tone] },
    }
  })
}

function formatIsoDay(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function calculateVisibleRange(start: Date, exclusiveEnd: Date): VisibleRange {
  return { from: formatIsoDay(start), to: formatIsoDay(new Date(exclusiveEnd.getTime() - DAY_MS)) }
}
