import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Frequency } from '@/types/api'

const DAY_MS = 24 * 60 * 60 * 1000

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function formatMoney(value: number, currency = 'UZS') {
  const safeValue = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'UZS' ? 0 : 2,
  }).format(safeValue)
}

/** Short money for tight spaces: "$1.2K", "UZS 350K". */
export function formatCompactMoney(value: number, currency = 'UZS') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0)
}

/** Parses an ISO date ("2026-05-14") as a local calendar day, not UTC midnight. */
export function parseLocalDate(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00`)
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayIsoDate(): string {
  return toIsoDate(new Date())
}

export function formatDate(value: string | undefined) {
  if (!value) return '—'
  const date = parseLocalDate(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/** Turns "2026-05" or "2026-05-01" into "May"; leaves anything else untouched. */
export function formatMonthLabel(value: string) {
  if (!/^\d{4}-\d{2}/.test(value)) return value
  const date = parseLocalDate(`${value.slice(0, 7)}-01`)
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}

export interface RenewalStatus {
  text: string
  days: number
  urgency: 'overdue' | 'today' | 'soon' | 'normal'
}

export function getRenewalStatus(dateString: string): RenewalStatus {
  if (!dateString) return { text: '—', days: 0, urgency: 'normal' }
  const today = parseLocalDate(todayIsoDate())
  const diffDays = Math.round((parseLocalDate(dateString).getTime() - today.getTime()) / DAY_MS)

  if (diffDays < 0) {
    const ago = Math.abs(diffDays)
    return { text: `${ago} ${ago === 1 ? 'day' : 'days'} ago`, days: diffDays, urgency: 'overdue' }
  }
  if (diffDays === 0) return { text: 'Today', days: 0, urgency: 'today' }
  if (diffDays === 1) return { text: 'Tomorrow', days: 1, urgency: 'soon' }
  if (diffDays <= 7) return { text: `In ${diffDays} days`, days: diffDays, urgency: 'soon' }
  if (diffDays <= 30) {
    const weeks = Math.round(diffDays / 7)
    return { text: `In ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`, days: diffDays, urgency: 'normal' }
  }
  const months = Math.round(diffDays / 30)
  return { text: `In ${months} ${months === 1 ? 'month' : 'months'}`, days: diffDays, urgency: 'normal' }
}

export function getAnnualizedCost(price: number, frequency: Frequency): number {
  switch (frequency) {
    case 'WEEKLY':
      return price * 52
    case 'MONTHLY':
      return price * 12
    case 'ANNUAL':
      return price
  }
}

export function getMonthlyEquivalent(price: number, frequency: Frequency): number {
  return getAnnualizedCost(price, frequency) / 12
}
